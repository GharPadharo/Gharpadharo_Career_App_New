import crypto from "crypto";
import { connectDB } from "./mongodb.js";
import Application from "../models/Application.js";
import ResumeAccessToken from "../models/ResumeAccessToken.js";
import { generateSecureResumeUrl } from "./cloudinary.js";

export const CANONICAL_APP_URL = "https://career.gharpadharo.com";

/**
 * Resolves the public, externally-reachable base URL for persistent external links (such as Google Sheets).
 * Never uses 'localhost' or '127.0.0.1' so that links in spreadsheets remain functional on any recruiter's device.
 *
 * Precedence:
 * 1. Explicit PUBLIC_APP_URL / CANONICAL_APP_URL environment variable (if non-localhost)
 * 2. NEXT_PUBLIC_APP_URL (if non-localhost)
 * 3. NEXTAUTH_URL / AUTH_URL (if non-localhost)
 * 4. Vercel deployment URL (VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL)
 * 5. Canonical production portal URL: https://career.gharpadharo.com
 *
 * @returns {string} Public base URL without trailing slash
 */
export function getPublicAppBaseUrl() {
  const candidates = [
    process.env.PUBLIC_APP_URL,
    process.env.CANONICAL_APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.AUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "string") continue;
    const trimmed = candidate.trim().replace(/\/+$/, "");
    if (!trimmed) continue;
    if (!/localhost|127\.0\.0\.1/i.test(trimmed)) {
      return trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    }
  }

  return CANONICAL_APP_URL;
}

/**
 * Alias for getPublicAppBaseUrl to ensure persistent resume URLs never contain localhost.
 * @returns {string}
 */
export function getAppBaseUrl() {
  return getPublicAppBaseUrl();
}

/**
 * Retrieves the cryptographic secret used for HMAC token derivation.
 * Fallback precedence: AUTH_SECRET -> NEXTAUTH_SECRET -> CLOUDINARY_API_SECRET
 * @returns {string}
 */
function getSecretKey() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.CLOUDINARY_API_SECRET;
  if (!secret) {
    throw new Error(
      "Server secret key is not configured for resume token operations. Define AUTH_SECRET or NEXTAUTH_SECRET."
    );
  }
  return secret.trim();
}

/**
 * Derives a high-entropy, 64-character hex bearer token using HMAC-SHA256.
 * Deterministic for a given application ID, resume public ID, and version,
 * allowing idempotent generation without ever storing the raw token in MongoDB.
 *
 * @param {string} applicationId
 * @param {string} [resumePublicId=""]
 * @param {number} [version=1]
 * @returns {string} 64-character hex token
 */
export function deriveRawToken(applicationId, resumePublicId = "", version = 1) {
  const secret = getSecretKey();
  const payload = `resume_access:${applicationId}:${resumePublicId || "none"}:v${version}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Generates a SHA-256 hash of the raw bearer token.
 * Only this hash is stored in MongoDB Atlas (privacy-by-design).
 *
 * @param {string} rawToken
 * @returns {string} 64-character hex hash
 */
export function hashToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") return "";
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

/**
 * Checks whether an application document has an attached resume.
 *
 * @param {Object} application
 * @returns {boolean}
 */
export function hasAttachedResume(application) {
  if (!application) return false;
  return Boolean(
    (application.resume &&
      (application.resume.publicId ||
        application.resume.fileUrl ||
        application.resume.fileName)) ||
      (typeof application.resume === "string" &&
        application.resume.trim() &&
        application.resume.trim() !== "—" &&
        application.resume.trim().toLowerCase() !== "not submitted") ||
      (application.resumeMetadata &&
        (application.resumeMetadata.publicId ||
          application.resumeMetadata.fileUrl ||
          application.resumeMetadata.fileName))
  );
}

/**
 * Gets or creates a persistent, token-brokered resume access link for an application.
 *
 * Idempotency Guarantees:
 * - If an active (non-revoked) ResumeAccessToken document exists, returns the existing persistent link.
 * - If no token document exists, creates one with version 1.
 * - Stores ONLY the SHA-256 hash in MongoDB. The raw token is returned to the caller for inclusion
 *   in Google Sheets or immediate response.
 *
 * @param {Object} application - MongoDB Application document or serialized object
 * @returns {Promise<{ rawToken: string, tokenHash: string, url: string, isNew: boolean } | null>}
 */
export async function getOrCreateResumeToken(application) {
  if (!application || !hasAttachedResume(application)) {
    return null;
  }

  const applicationId = (
    application._id?.toString() ||
    application.id?.toString() ||
    ""
  ).trim();

  if (!applicationId) {
    return null;
  }

  const applicationNumber =
    typeof application.applicationNumber === "number"
      ? application.applicationNumber
      : typeof application.applicationNumber === "string" &&
        !isNaN(Number(application.applicationNumber))
      ? Number(application.applicationNumber)
      : undefined;

  const resumePublicId = (
    application.resume?.publicId ||
    application.resumeMetadata?.publicId ||
    ""
  ).trim();

  await connectDB();

  // 1. Look for an existing active token document
  const activeDoc = await ResumeAccessToken.findOne({
    applicationId,
    isRevoked: false,
  });

  if (activeDoc) {
    const rawToken = deriveRawToken(
      applicationId,
      activeDoc.resumePublicId || resumePublicId,
      activeDoc.version || 1
    );

    return {
      rawToken,
      tokenHash: activeDoc.tokenHash,
      url: `${getAppBaseUrl()}/api/resumes/${rawToken}`,
      version: activeDoc.version || 1,
      isNew: false,
    };
  }

  // 2. If no active token exists, find previous tokens (if any) to determine next version
  const latestToken = await ResumeAccessToken.findOne({ applicationId }).sort({
    version: -1,
  });
  const version = (latestToken?.version || 0) + 1;

  const rawToken = deriveRawToken(applicationId, resumePublicId, version);
  const tokenHash = hashToken(rawToken);

  await ResumeAccessToken.create({
    tokenHash,
    applicationId,
    applicationNumber,
    resumePublicId,
    version,
    isRevoked: false,
  });

  return {
    rawToken,
    tokenHash,
    url: `${getAppBaseUrl()}/api/resumes/${rawToken}`,
    version,
    isNew: true,
  };
}

/**
 * Verifies a raw bearer token against MongoDB and resolves a fresh, short-lived signed Cloudinary URL.
 *
 * Security Guarantees:
 * - Hashes the incoming token and looks up by tokenHash (never queries raw tokens).
 * - Enforces that the token is not revoked.
 * - Verifies that the underlying Application and resume asset still exist in MongoDB.
 * - Generates a 15-minute expiring signed Cloudinary URL using server credentials.
 * - Returns null for any discrepancy without leaking whether the candidate/token exists.
 * - Updates access metrics (accessCount, lastAccessedAt) asynchronously.
 *
 * @param {string} rawToken - The 64-character bearer token from the request path
 * @returns {Promise<{ application: Object, fileName: string, secureUrl: string, expiresAt: number, resourceType: string } | null>}
 */
export async function verifyAndResolveResumeToken(rawToken) {
  if (
    !rawToken ||
    typeof rawToken !== "string" ||
    !/^[a-f0-9]{64}$/i.test(rawToken.trim())
  ) {
    return null;
  }

  const tokenHash = hashToken(rawToken);

  try {
    await connectDB();

    const tokenDoc = await ResumeAccessToken.findOne({
      tokenHash,
      isRevoked: false,
    });

    if (!tokenDoc) {
      return null;
    }

    const application = await Application.findById(tokenDoc.applicationId).select(
      "candidate firstName lastName email resume applicationNumber"
    );

    if (!application) {
      return null;
    }

    const resumeData = application.resume;
    const publicId = resumeData?.publicId || tokenDoc.resumePublicId || "";
    const fileUrl = resumeData?.fileUrl || "";
    const fileName = resumeData?.fileName || "resume.pdf";
    const mimeType = resumeData?.mimeType || "application/pdf";

    if (!publicId && !fileUrl) {
      return null;
    }

    const secureResult = generateSecureResumeUrl({
      publicId,
      fileUrl,
      fileName,
      mimeType,
      expiresInSeconds: 900, // 15-minute Cloudinary signed view link
    });

    if (!secureResult?.secureUrl) {
      return null;
    }

    // Atomically increment access telemetry
    ResumeAccessToken.updateOne(
      { _id: tokenDoc._id },
      {
        $inc: { accessCount: 1 },
        $set: { lastAccessedAt: new Date() },
      }
    ).catch((statsErr) => {
      console.warn("Failed to update resume access telemetry:", statsErr?.message || statsErr);
    });

    return {
      application,
      fileName,
      secureUrl: secureResult.secureUrl,
      expiresAt: secureResult.expiresAt,
      resourceType: secureResult.resourceType,
    };
  } catch (error) {
    console.error("verifyAndResolveResumeToken error:", error?.message || error);
    return null;
  }
}

/**
 * Revokes a resume access token by raw token, token hash, or application ID.
 *
 * @param {Object} options
 * @param {string} [options.rawToken]
 * @param {string} [options.tokenHash]
 * @param {string} [options.applicationId]
 * @param {string} [options.revokedBy="admin"]
 * @returns {Promise<{ success: boolean, modifiedCount: number }>}
 */
export async function revokeResumeToken({
  rawToken,
  tokenHash,
  applicationId,
  revokedBy = "admin",
}) {
  await connectDB();

  const query = { isRevoked: false };
  if (tokenHash) {
    query.tokenHash = tokenHash;
  } else if (rawToken) {
    query.tokenHash = hashToken(rawToken);
  } else if (applicationId) {
    query.applicationId = applicationId;
  } else {
    throw new Error("Either rawToken, tokenHash, or applicationId is required to revoke a token.");
  }

  const result = await ResumeAccessToken.updateMany(query, {
    $set: {
      isRevoked: true,
      revokedAt: new Date(),
      revokedBy: revokedBy.trim(),
    },
  });

  return {
    success: true,
    modifiedCount: result.modifiedCount || 0,
  };
}
