import { NextResponse } from "next/server";
import {
  RATE_LIMIT_RULES,
  addRateLimitHeaders,
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rateLimit";
import { verifyAndResolveResumeToken } from "@/lib/resumeTokens";

export const dynamic = "force-dynamic";

/**
 * GET /api/resumes/[token]
 *
 * Public endpoint for persistent, token-brokered resume access:
 * - Validates high-entropy bearer token against SHA-256 hash in MongoDB
 * - Enforces rate limiting per client IP (60 requests / 5 minutes)
 * - Verifies token is active (not revoked) and associated candidate resume exists
 * - Generates short-lived (15-min) Cloudinary signed URL
 * - Redirects (307) on browser navigation or returns JSON when requested
 * - Generic 404 response on any failure to prevent user enumeration
 */
export async function GET(request, context) {
  // 1. Rate limiting by client IP
  const clientIp = getClientIp(request);
  const ipRateLimit = await checkRateLimit({
    endpointScope: "resume_access",
    identifier: clientIp,
    limit: RATE_LIMIT_RULES.resumeAccess.limit,
    windowSeconds: RATE_LIMIT_RULES.resumeAccess.windowSeconds,
  });

  if (!ipRateLimit.allowed) {
    return createRateLimitResponse(ipRateLimit);
  }

  try {
    const params = await context.params;
    const token = (params?.token || "").trim();

    // 2. Validate token format (64-character hex string)
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      const res = NextResponse.json(
        {
          success: false,
          error: "Resume link is invalid, expired, or has been revoked.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, private",
          },
        }
      );
      res.headers.set("Cache-Control", "no-store, private");
      addRateLimitHeaders(res, ipRateLimit);
      return res;
    }

    // 3. Verify token and resolve fresh short-lived Cloudinary URL
    const resolved = await verifyAndResolveResumeToken(token);

    if (!resolved || !resolved.secureUrl) {
      const res = NextResponse.json(
        {
          success: false,
          error: "Resume link is invalid, expired, or has been revoked.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, private",
          },
        }
      );
      res.headers.set("Cache-Control", "no-store, private");
      addRateLimitHeaders(res, ipRateLimit);
      return res;
    }

    // 4. Return JSON if explicitly requested, otherwise redirect (307)
    const acceptHeader = request.headers.get("accept") || "";
    const urlObj = new URL(request.url);
    const wantsJson =
      acceptHeader.includes("application/json") ||
      urlObj.searchParams.get("format") === "json";

    if (wantsJson) {
      const res = NextResponse.json(
        {
          success: true,
          url: resolved.secureUrl,
          fileName: resolved.fileName || "resume.pdf",
          expiresAt: resolved.expiresAt,
        },
        {
          headers: {
            "Cache-Control": "no-store, private",
          },
        }
      );
      res.headers.set("Cache-Control", "no-store, private");
      addRateLimitHeaders(res, ipRateLimit);
      return res;
    }

    // HTTP 307 redirect with explicit no-store, private caching policy
    // Ensures temporary signed Cloudinary URLs (15-min TTL) are not cached by browsers or shared intermediate proxies
    const res = NextResponse.redirect(resolved.secureUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, private",
      },
    });
    res.headers.set("Cache-Control", "no-store, private");
    addRateLimitHeaders(res, ipRateLimit);
    return res;
  } catch (error) {
    console.error("Error in GET /api/resumes/[token]:", error?.message || error);
    const res = NextResponse.json(
      {
        success: false,
        error: "Resume link is invalid, expired, or has been revoked.",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store, private",
        },
      }
    );
    res.headers.set("Cache-Control", "no-store, private");
    addRateLimitHeaders(res, ipRateLimit);
    return res;
  }
}
