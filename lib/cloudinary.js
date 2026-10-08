import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

/**
 * Server-only Cloudinary Helper
 * 
 * Securely handles resume uploads and cleanup:
 * - Credentials loaded exclusively from server environment variables
 * - API secret is NEVER exposed to client-side bundles
 * - Strictly stores under "gharpadharo-careers/resumes" folder
 * - Generates collision-resistant, cryptographically secure public IDs
 */

export const RESUME_FOLDER = "gharpadharo-careers/resumes";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream", // fallback from certain OS/browsers
];

/**
 * Check if Cloudinary is configured in the current environment
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return Boolean(
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    CLOUDINARY_CLOUD_NAME.trim() &&
    CLOUDINARY_API_KEY.trim() &&
    CLOUDINARY_API_SECRET.trim()
  );
}

/**
 * Configure and return the Cloudinary v2 SDK instance
 */
export function getCloudinaryClient() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured. Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server environment."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });

  return cloudinary;
}

/**
 * Validates buffer magic bytes for allowed document types
 * @param {Buffer} buffer 
 * @param {string} extension 
 * @returns {boolean}
 */
export function validateMagicBytes(buffer, extension) {
  if (!buffer || buffer.length < 4) return false;
  const ext = extension.toLowerCase();

  // PDF: %PDF-
  if (ext === ".pdf") {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  // DOCX: PK\x03\x04 (ZIP container)
  if (ext === ".docx") {
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    );
  }

  // DOC: OLE2 compound document 0xD0 0xCF 0x11 0xE0
  if (ext === ".doc") {
    return (
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0
    );
  }

  return false;
}

/**
 * Uploads a document buffer to Cloudinary with safe unique public ID
 * @param {Buffer} buffer 
 * @param {string} originalFileName 
 * @param {string} extension 
 * @returns {Promise<{ fileUrl: string, publicId: string, resourceType: string, bytes: number }>}
 */
export async function uploadResumeBuffer(buffer, originalFileName, extension) {
  const client = getCloudinaryClient();

  const safeRandom = crypto.randomBytes(12).toString("hex");
  const timestamp = Date.now();
  const publicId = `${RESUME_FOLDER}/resume_${timestamp}_${safeRandom}`;

  return new Promise((resolve, reject) => {
    // For documents (PDF, DOC, DOCX), use resource_type: "auto" so Cloudinary handles raw/document formats correctly without rasterization
    const uploadStream = client.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "auto",
        type: "authenticated",
        folder: undefined, // folder already prefixed in public_id
        overwrite: false,
        use_filename: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return reject(new Error("Cloudinary upload failed"));
        }
        resolve({
          fileUrl: result.secure_url || result.url,
          publicId: result.public_id,
          resourceType: result.resource_type || "auto",
          bytes: result.bytes || buffer.length,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Server-side helper to delete an uploaded resume from Cloudinary
 * Used for cleanup when application creation fails after upload or during admin bulk delete.
 *
 * Supports both new authenticated resumes (type: "authenticated") and legacy public resumes (type: "upload").
 * Only returns { success: true } when Cloudinary explicitly reports successful deletion ("ok").
 *
 * @param {string} publicId 
 * @param {string} [resourceType="image"]
 * @param {string} [deliveryType] - Optional delivery type ("authenticated" or "upload")
 * @returns {Promise<{ success: boolean, result?: string }>}
 */
export async function deleteResume(publicId, resourceType = "image", deliveryType = undefined) {
  if (!publicId || typeof publicId !== "string") {
    return { success: false };
  }

  // Security check: Only allow deleting files in our dedicated resume folder
  if (!publicId.startsWith(RESUME_FOLDER)) {
    console.warn(`Refusing to delete publicId outside resume folder: ${publicId}`);
    return { success: false };
  }

  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary not configured; skipping remote deleteResume.");
    return { success: false };
  }

  try {
    const client = getCloudinaryClient();
    // Cloudinary uploader.destroy does not accept 'auto'. PDFs are stored under 'image' (or occasionally 'raw').
    const primaryResourceType = (!resourceType || resourceType === "auto") ? "image" : resourceType;
    const fallbackResourceType = primaryResourceType === "image" ? "raw" : "image";

    // Attempt authenticated delivery first (new standard), then upload delivery (legacy fallback)
    const deliveryTypesToTry = deliveryType
      ? [deliveryType, deliveryType === "authenticated" ? "upload" : "authenticated"]
      : ["authenticated", "upload"];

    const resourceTypesToTry = [primaryResourceType, fallbackResourceType];

    let lastResult = null;

    for (const dType of deliveryTypesToTry) {
      for (const rType of resourceTypesToTry) {
        try {
          const res = await client.uploader.destroy(publicId, {
            resource_type: rType,
            type: dType,
            invalidate: true,
          });

          if (res && res.result === "ok") {
            return { success: true, result: "ok" };
          }
          if (res?.result) {
            lastResult = res.result;
          }
        } catch (callErr) {
          lastResult = callErr?.message || "error";
        }
      }
    }

    return { success: false, result: lastResult || "not found" };
  } catch (err) {
    console.error("Failed to delete Cloudinary file:", err);
    return { success: false, result: err?.message || "error" };
  }
}

/**
 * Generates an authorized, short-lived signed Cloudinary URL for candidate resumes
 * 
 * - Credentials and HMAC signing happen strictly on the server
 * - Expiring signature prevents unauthorized public scraping or permanent link leaks
 * - Automatically handles both image (PDF) and raw (DOC/DOCX) document assets
 * 
 * @param {Object} params
 * @param {string} [params.publicId] - Stored Cloudinary public ID
 * @param {string} [params.fileUrl] - Stored Cloudinary file URL (used for fallback publicId extraction)
 * @param {string} [params.fileName] - Original document file name
 * @param {string} [params.mimeType] - Document MIME type
 * @param {number} [params.expiresInSeconds=900] - Lifespan of the signed access link (default 15 minutes)
 * @returns {{ secureUrl: string, expiresAt: number, resourceType: string }|null}
 */
export function generateSecureResumeUrl({
  publicId,
  fileUrl,
  fileName = "resume.pdf",
  mimeType = "application/pdf",
  expiresInSeconds = 900,
}) {
  if (!isCloudinaryConfigured()) {
    console.warn("generateSecureResumeUrl: Cloudinary credentials not configured.");
    return null;
  }

  const client = getCloudinaryClient();

  // 1. Resolve publicId
  let resolvedPublicId = (publicId || "").trim();
  if (!resolvedPublicId && fileUrl) {
    const match = fileUrl.match(/(gharpadharo-careers\/resumes\/[^./?#]+)/);
    if (match) {
      resolvedPublicId = match[1];
    }
  }

  if (!resolvedPublicId) {
    console.warn("generateSecureResumeUrl: Unable to resolve publicId from input.");
    return null;
  }

  // Security boundary: Only allow generating secure resume URLs for assets in the resumes folder
  if (!resolvedPublicId.startsWith(RESUME_FOLDER)) {
    console.warn(`generateSecureResumeUrl: Refusing to generate URL for asset outside resume folder: ${resolvedPublicId}`);
    return null;
  }

  // 2. Determine resource_type ('image' or 'raw')
  let resourceType = "image";
  const lowerUrl = (fileUrl || "").toLowerCase();
  const lowerName = (fileName || "").toLowerCase();
  const lowerMime = (mimeType || "").toLowerCase();

  if (
    lowerUrl.includes("/raw/") ||
    lowerName.endsWith(".doc") ||
    lowerName.endsWith(".docx") ||
    lowerMime.includes("word") ||
    (lowerMime.includes("octet-stream") && !lowerName.endsWith(".pdf"))
  ) {
    resourceType = "raw";
  }

  // 3. Determine delivery type ('authenticated' or 'upload')
  // New resume assets default to 'authenticated'. Legacy assets explicitly containing '/upload/' (and not '/authenticated/') use 'upload'.
  let deliveryType = "authenticated";
  if (lowerUrl.includes("/upload/") && !lowerUrl.includes("/authenticated/")) {
    deliveryType = "upload";
  }

  // 4. Determine format
  let format = "";
  if (resourceType === "image") {
    format = "pdf";
  }

  // 5. Compute expiration timestamp
  const expiresAt = Math.floor(Date.now() / 1000) + Math.max(60, expiresInSeconds);

  try {
    const secureUrl = client.utils.private_download_url(resolvedPublicId, format, {
      resource_type: resourceType,
      type: deliveryType,
      expires_at: expiresAt,
    });

    return {
      secureUrl,
      expiresAt,
      resourceType,
    };
  } catch (error) {
    console.error("Failed to generate secure resume URL:", error);
    return null;
  }
}

