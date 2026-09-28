import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { requireAdminAuth } from "@/lib/authGuard";
import { deleteResume } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_BATCH_SIZE = 100;

/**
 * DELETE /api/admin/applications/bulk
 * 
 * Secure bulk deletion endpoint for candidate applications:
 * - Strictly guarded by requireAdminAuth() (admin & superadmin only)
 * - Validates request body: non-empty array of valid MongoDB ObjectIds
 * - Enforces maximum batch limit (100)
 * - Deduplicates incoming IDs safely
 * - Cloudinary resume cleanup: If an application has an associated resume asset,
 *   attempts deletion first. If Cloudinary cleanup fails, the MongoDB application
 *   is NOT deleted, ensuring consistency and preventing orphaned data.
 * - Deletes corresponding Application documents from MongoDB
 * - Leaves Jobs and Users completely untouched
 */
export async function DELETE(request) {
  // 1. Authorization Check
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  // 2. Parse and Validate Request Body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { ids } = body || {};

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json(
      { success: false, error: "Request body must contain an 'ids' array." },
      { status: 400 }
    );
  }

  if (ids.length === 0) {
    return NextResponse.json(
      { success: false, error: "The 'ids' array cannot be empty." },
      { status: 400 }
    );
  }

  if (ids.length > MAX_BATCH_SIZE) {
    return NextResponse.json(
      {
        success: false,
        error: `Batch size exceeds the maximum limit of ${MAX_BATCH_SIZE} applications per deletion request.`,
      },
      { status: 400 }
    );
  }

  // Validate ObjectId format for every item in array
  for (const id of ids) {
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid application ID format: '${id}'. All IDs must be valid MongoDB ObjectIds.`,
        },
        { status: 400 }
      );
    }
  }

  try {
    await connectDB();

    // 3. Deduplicate IDs
    const uniqueIds = Array.from(new Set(ids));

    // 4. Fetch matching application documents
    const applications = await Application.find({ _id: { $in: uniqueIds } });
    const foundMap = new Map(applications.map((app) => [app._id.toString(), app]));

    const missingIds = [];
    for (const id of uniqueIds) {
      if (!foundMap.has(id)) {
        missingIds.push(id);
      }
    }

    const deletableIds = [];
    const failed = [];

    // 5. Cloudinary Resume Cleanup Check
    for (const app of applications) {
      const appId = app._id.toString();
      const resumePublicId = app.resume?.publicId;

      if (resumePublicId && typeof resumePublicId === "string" && resumePublicId.trim()) {
        try {
          const cleanupResult = await deleteResume(resumePublicId);
          if (cleanupResult.success) {
            deletableIds.push(app._id);
          } else {
            failed.push({
              id: appId,
              candidate: app.candidate,
              reason: "Resume file cleanup on storage service failed. Database record preserved.",
            });
          }
        } catch {
          failed.push({
            id: appId,
            candidate: app.candidate,
            reason: "Could not contact storage service to remove resume file. Database record preserved.",
          });
        }
      } else {
        // No uploaded resume asset exists in Cloudinary
        deletableIds.push(app._id);
      }
    }

    // 6. Delete MongoDB Application records where cleanup was successful or not needed
    let deletedCount = 0;
    if (deletableIds.length > 0) {
      const deleteResult = await Application.deleteMany({ _id: { $in: deletableIds } });
      deletedCount = deleteResult.deletedCount;
    }

    return NextResponse.json({
      success: failed.length === 0,
      requestedCount: uniqueIds.length,
      deletedCount,
      deletedIds: deletableIds.map((id) => id.toString()),
      failedCount: failed.length,
      failed,
      missingCount: missingIds.length,
      missingIds,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/applications/bulk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete applications due to internal server error." },
      { status: 500 }
    );
  }
}
