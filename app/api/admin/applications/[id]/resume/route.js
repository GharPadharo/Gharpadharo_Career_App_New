import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { requireAdminAuth } from "@/lib/authGuard";
import { generateSecureResumeUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/applications/[id]/resume
 * 
 * Secure endpoint to access a candidate's resume:
 * - Requires authenticated admin/superadmin session
 * - Resolves application from MongoDB
 * - Validates presence of candidate resume
 * - Generates short-lived, signed Cloudinary download/view URL (15-min expiration)
 * - Exposes ZERO secrets to client
 * - Redirects directly to the secure signed URL on direct navigation,
 *   or returns JSON with the secure URL when requested via fetch / Accept: application/json
 */
export async function GET(request, context) {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    let application;
    if (mongoose.Types.ObjectId.isValid(id)) {
      application = await Application.findById(id).select("candidate resume");
    } else if (/^\d+$/.test(id)) {
      application = await Application.findOne({ applicationNumber: Number(id) }).select("candidate resume");
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid application ID." },
        { status: 404 }
      );
    }
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const resumeData = application.resume;
    const publicId = resumeData?.publicId || "";
    const fileUrl = resumeData?.fileUrl || "";
    const fileName = resumeData?.fileName || "resume.pdf";
    const mimeType = resumeData?.mimeType || "application/pdf";

    if (!publicId && !fileUrl) {
      return NextResponse.json(
        { success: false, error: "No resume document found for this candidate." },
        { status: 404 }
      );
    }

    const secureResult = generateSecureResumeUrl({
      publicId,
      fileUrl,
      fileName,
      mimeType,
      expiresInSeconds: 900, // 15 minutes
    });

    if (!secureResult?.secureUrl) {
      return NextResponse.json(
        { success: false, error: "Could not generate secure resume access URL." },
        { status: 500 }
      );
    }

    // Check if client expects JSON or direct redirect
    const acceptHeader = request.headers.get("accept") || "";
    const urlObj = new URL(request.url);
    const wantsJson =
      acceptHeader.includes("application/json") ||
      urlObj.searchParams.get("format") === "json";

    if (wantsJson) {
      return NextResponse.json({
        success: true,
        url: secureResult.secureUrl,
        fileName,
        expiresAt: secureResult.expiresAt,
      });
    }

    // Direct browser navigation redirects to the secure signed Cloudinary URL
    return NextResponse.redirect(secureResult.secureUrl, { status: 307 });
  } catch (error) {
    console.error("Error in GET /api/admin/applications/[id]/resume:", error);
    return NextResponse.json(
      { success: false, error: "Failed to access candidate resume." },
      { status: 500 }
    );
  }
}
