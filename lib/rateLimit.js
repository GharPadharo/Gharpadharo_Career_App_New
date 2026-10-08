import crypto from "crypto";
import { connectDB } from "./mongodb.js";
import RateLimit from "../models/RateLimit.js";

/**
 * Exact rate limit rules for public portal endpoints
 */
export const RATE_LIMIT_RULES = {
  resumeUpload: {
    limit: 8,
    windowSeconds: 15 * 60, // 15 minutes (900 seconds)
  },
  applicationSubmissionIp: {
    limit: 5,
    windowSeconds: 15 * 60, // 15 minutes (900 seconds)
  },
  applicationSubmissionEmail: {
    limit: 3,
    windowSeconds: 60 * 60, // 1 hour (3600 seconds)
  },
};

/**
 * Validates whether a candidate string conforms to a valid IPv4 or IPv6 pattern
 * @param {string} ip
 * @returns {boolean}
 */
function isValidIp(ip) {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();
  // Standard IPv4
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // Standard IPv6 or mapped IPv4
  const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){1,7}[a-fA-F0-9]{1,4}$|^::1$|^::ffff:(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed);
}

/**
 * Safely extracts client IP address from trusted proxy headers
 * 
 * Evaluation Order (Hardened Precedence):
 * 1. x-vercel-forwarded-for (Vercel edge network — prioritized to prevent header spoofing)
 * 2. x-forwarded-for (Standard multi-hop reverse proxy chain, leftmost client IP)
 * 3. x-real-ip (Nginx / Cloud reverse proxies)
 * 4. cf-connecting-ip (Cloudflare edge proxy fallback when preceding headers absent)
 * 5. request.ip (Direct socket remoteAddress where supported)
 * 6. Safe Fallback:
 *    - In development/test environments or localhost requests, defaults to "127.0.0.1".
 *    - In production if all proxy headers are absent, hashes User-Agent + Accept-Language
 *      to isolate client buckets while remaining safe.
 * 
 * @param {Request} request 
 * @returns {string} Safe client IP or isolated client identifier
 */
export function getClientIp(request) {
  const headers = request.headers;

  // 1. Vercel Forwarded IP (Trusted hosting-platform header prioritized to prevent spoofing)
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (isValidIp(candidate)) {
      return candidate;
    }
  }

  // 2. Standard X-Forwarded-For (Leftmost entry from reverse proxy chain)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const candidate = forwardedFor.split(",")[0].trim();
    if (isValidIp(candidate)) {
      return candidate;
    }
  }

  // 3. Nginx / Standard Reverse Proxy Real IP
  const realIp = headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) {
    return realIp.trim();
  }

  // 4. Cloudflare Connecting IP (Retained as fallback only after trusted hosting/proxy headers)
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp)) {
    return cfIp.trim();
  }

  // 5. Native Next.js socket IP if populated
  if (request.ip && isValidIp(request.ip)) {
    return request.ip.trim();
  }

  // 6. Safe Fallback Strategy
  const host = headers.get("host") || "";
  const isLocal =
    process.env.NODE_ENV !== "production" ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  if (isLocal) {
    return "127.0.0.1";
  }

  // Production fallback: Isolate unidentified requests using request metadata hash
  // instead of a single universal bucket that would collapse all users into one shared pool.
  const userAgent = headers.get("user-agent") || "unidentified-agent";
  const acceptLang = headers.get("accept-language") || "unidentified-lang";
  const metadataDigest = crypto
    .createHash("sha256")
    .update(`${userAgent}:${acceptLang}`)
    .digest("hex")
    .slice(0, 16);

  return `unidentified_${metadataDigest}`;
}

/**
 * Generates a SHA-256 hash of the normalized identifier
 * Ensures raw IP addresses are NEVER stored in the database (privacy-by-design)
 * 
 * @param {string} identifier 
 * @returns {string} 64-character hex digest
 */
export function hashIdentifier(identifier) {
  const normalized = (identifier || "").trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Builds the composite rate-limit key including endpoint scope and hashed identifier
 * 
 * @param {string} endpointScope 
 * @param {string} identifier 
 * @returns {string} E.g. "ratelimit:resume_upload:a1b2c3..."
 */
export function buildRateLimitKey(endpointScope, identifier) {
  const hash = hashIdentifier(identifier);
  return `ratelimit:${endpointScope}:${hash}`;
}

/**
 * Executes an atomic, concurrency-safe rate limit check in MongoDB Atlas
 * 
 * Atomicity Guarantees:
 * - Uses MongoDB atomic operations ($inc and $set) to prevent race conditions.
 * - If an active, unexpired window exists, atomically increments the request count.
 * - If the window has expired or does not exist, atomically resets count to 1 with a new expiry.
 * - If the limit is exceeded, clamps count to prevent infinite counter inflation.
 * - Does not leak raw IP, database errors, or internal keys to clients.
 * 
 * @param {Object} options
 * @param {string} options.endpointScope - Name of endpoint scope (e.g. "resume_upload")
 * @param {string} options.identifier - Client IP or normalized candidate email
 * @param {number} options.limit - Maximum permitted requests in window
 * @param {number} options.windowSeconds - Window duration in seconds
 * @returns {Promise<{
 *   allowed: boolean,
 *   limit: number,
 *   remaining: number,
 *   reset: number,
 *   retryAfter: number,
 *   dbError?: boolean
 * }>}
 */
export async function checkRateLimit({
  endpointScope,
  identifier,
  limit,
  windowSeconds,
}) {
  const key = buildRateLimitKey(endpointScope, identifier);
  const now = new Date();
  const windowMs = Math.max(1, windowSeconds) * 1000;
  const newExpiresAt = new Date(now.getTime() + windowMs);

  try {
    await connectDB();

    // 1. Try to atomically increment within an active, unexpired window
    let doc = await RateLimit.findOneAndUpdate(
      { key, expiresAt: { $gt: now } },
      { $inc: { count: 1 } },
      { returnDocument: "after" }
    );

    // 2. If no active document exists (first request or previous window expired),
    // atomically reset / upsert the counter to 1 with a fresh expiration date.
    if (!doc) {
      doc = await RateLimit.findOneAndUpdate(
        { key },
        {
          $set: { count: 1, expiresAt: newExpiresAt },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    const currentCount = typeof doc.count === "number" ? doc.count : 1;
    const docExpiresAt = doc.expiresAt instanceof Date ? doc.expiresAt : newExpiresAt;
    const resetTimestamp = Math.ceil(docExpiresAt.getTime() / 1000);
    const retryAfter = Math.max(1, Math.ceil((docExpiresAt.getTime() - now.getTime()) / 1000));

    // 3. Evaluate limit
    if (currentCount > limit) {
      // Clamp count to prevent counter ballooning under heavy denial-of-service attempts
      await RateLimit.updateOne(
        { key, count: { $gt: limit } },
        { $set: { count: limit } }
      ).catch(() => {});

      return {
        allowed: false,
        limit,
        remaining: 0,
        reset: resetTimestamp,
        retryAfter,
      };
    }

    const remaining = Math.max(0, limit - currentCount);

    return {
      allowed: true,
      limit,
      remaining,
      reset: resetTimestamp,
      retryAfter: 0,
    };
  } catch (error) {
    // Security Tradeoff Note:
    // If the rate-limiting database operation fails, we log the error internally without
    // leaking database connection details to the client. We fail closed with dbError: true
    // so public endpoints can return a clean 503 response. This prevents downstream
    // Cloudinary quota burnout or corrupted submissions during database outages.
    console.error("Rate limiting check failed unexpectedly:", error?.message || error);
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: Math.ceil(Date.now() / 1000) + 60,
      retryAfter: 60,
      dbError: true,
    };
  }
}

/**
 * Creates a standardized RFC 6585 HTTP 429 Too Many Requests response
 * 
 * @param {Object} rateLimitResult 
 * @returns {NextResponse}
 */
export function createRateLimitResponse(rateLimitResult) {
  // If the block is due to an internal database outage, return 503 Service Unavailable
  if (rateLimitResult.dbError) {
    return Response.json(
      {
        success: false,
        error: "Service temporarily unavailable. Please try again shortly.",
      },
      {
        status: 503,
        headers: {
          "Retry-After": "60",
        },
      }
    );
  }

  const retryAfter = Math.max(1, rateLimitResult.retryAfter || 60);
  const reset = rateLimitResult.reset || Math.ceil(Date.now() / 1000) + retryAfter;

  return Response.json(
    {
      success: false,
      error: "Too many requests. Please wait a few minutes before trying again.",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(rateLimitResult.limit || 0),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}

/**
 * Attaches standard X-RateLimit headers to a successful NextResponse
 * 
 * @param {NextResponse} response 
 * @param {Object} rateLimitResult 
 * @returns {NextResponse}
 */
export function addRateLimitHeaders(response, rateLimitResult) {
  if (!response || !rateLimitResult) return response;

  if (typeof rateLimitResult.limit === "number") {
    response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
  }
  if (typeof rateLimitResult.remaining === "number") {
    response.headers.set("X-RateLimit-Remaining", String(Math.max(0, rateLimitResult.remaining)));
  }
  if (typeof rateLimitResult.reset === "number") {
    response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));
  }

  return response;
}
