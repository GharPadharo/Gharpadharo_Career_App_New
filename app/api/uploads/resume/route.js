import { NextResponse } from "next/server";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  isCloudinaryConfigured,
  uploadResumeBuffer,
  validateMagicBytes,
} from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * POST /api/uploads/resume
 * 
 * Secure endpoint to upload candidate resumes to Cloudinary.
 * - Accepts multipart/form-data with a "file" or "resume" field
 * - Validates file size (<= 10MB)
 * - Validates extension (.pdf, .doc, .docx)
 * - Validates MIME type
 * - Inspects magic bytes to prevent spoofed/disguised binaries
 * - Uploads to Cloudinary folder "gharpadharo-careers/resumes" with unique public ID
 * - Returns only clean metadata needed by client without secrets
 */
export async function POST(request) {
  try {
    let formData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid form data submission." },
        { status: 400 }
      );
    }

    const file = formData.get("file") || formData.get("resume");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Please select a resume file to upload." },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume.pdf";
    const fileSize = typeof file.size === "number" ? file.size : 0;
    const mimeType = (file.type || "").toLowerCase().trim() || "application/octet-stream";

    // 1. File size checks
    if (fileSize <= 0) {
      return NextResponse.json(
        { success: false, error: "The uploaded file is empty. Please select a valid document." },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 10 MB limit. Please upload a smaller file." },
        { status: 400 }
      );
    }

    // 2. Extension validation
    const lastDot = fileName.lastIndexOf(".");
    if (lastDot === -1) {
      return NextResponse.json(
        { success: false, error: "Uploaded file must have an extension (.pdf, .doc, or .docx)." },
        { status: 400 }
      );
    }

    const extension = fileName.slice(lastDot).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF, DOC, and DOCX files are permitted." },
        { status: 400 }
      );
    }

    // 3. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { success: false, error: "Invalid file format. Only PDF, DOC, and DOCX files are permitted." },
        { status: 400 }
      );
    }

    // Read buffer and check magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateMagicBytes(buffer, extension)) {
      return NextResponse.json(
        {
          success: false,
          error: "Corrupted or invalid document contents. Please upload a genuine PDF, DOC, or DOCX document.",
        },
        { status: 400 }
      );
    }

    // Check Cloudinary environment
    if (!isCloudinaryConfigured()) {
      console.error("Cloudinary credentials are not configured in .env.local / server environment.");
      return NextResponse.json(
        {
          success: false,
          error: "Resume upload service is temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    // 4. Upload buffer to Cloudinary
    const uploadResult = await uploadResumeBuffer(buffer, fileName, extension);

    return NextResponse.json(
      {
        success: true,
        resume: {
          fileName,
          fileUrl: uploadResult.fileUrl,
          publicId: uploadResult.publicId,
          fileSize,
          mimeType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/uploads/resume:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during resume upload. Please try again.",
      },
      { status: 500 }
    );
  }
}
