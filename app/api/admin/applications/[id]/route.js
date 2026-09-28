import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import User from "@/models/User";
import { requireAdminAuth } from "@/lib/authGuard";
import { serializeApplication } from "@/lib/applicationSerializer";
import { logActivity } from "@/lib/activityLogger";

export const dynamic = "force-dynamic";

function findAppQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { _id: null };
}

/**
 * GET /api/admin/applications/[id]
 * Fetch a single candidate application for detailed review.
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 404 }
      );
    }

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: serializeApplication(application),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/applications/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/applications/[id]
 * Update application status ("new" | "viewed").
 * - When transitioning to "viewed", securely attaches viewedAt timestamp and viewedBy admin ID.
 * - Does NOT trust browser-supplied viewedBy or admin IDs.
 * - Prevents tampering with candidate email, phone, or job linkage.
 */
export async function PATCH(request, context) {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 404 }
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Only allow updating status
    if (body.status !== undefined) {
      const normalizedStatus = body.status.toLowerCase();
      if (!["new", "viewed"].includes(normalizedStatus)) {
        return NextResponse.json(
          { success: false, error: "Invalid status. Must be 'new' or 'viewed'." },
          { status: 400 }
        );
      }

      const previousStatus = application.status;

      if (normalizedStatus === "viewed") {
        application.status = "viewed";
        if (!application.viewedAt) {
          application.viewedAt = new Date();
        }

        // Resolve admin user ID securely from server session
        let adminDoc = null;
        if (authResult.user.email) {
          adminDoc = await User.findOne({
            email: authResult.user.email.toLowerCase(),
          });
          if (adminDoc) {
            application.viewedBy = adminDoc._id;
          }
        }

        if (previousStatus !== "viewed") {
          const candidateName =
            application.candidate ||
            `${application.firstName || ""} ${application.lastName || ""}`.trim() ||
            "Candidate";

          await logActivity({
            type: "application_viewed",
            title: "Application viewed",
            description: `${candidateName}'s application was viewed`,
            entityType: "application",
            entityId: application._id,
            actorId: adminDoc?._id || null,
            metadata: {
              candidateName,
              jobTitle:
                application.jobTitle ||
                (application.applicationType === "general"
                  ? "General Application"
                  : "Position"),
              jobSlug: application.jobSlug || "",
              status: "viewed",
            },
          });
        }
      } else {
        application.status = "new";
        application.viewedAt = undefined;
        application.viewedBy = undefined;

        if (previousStatus !== "new") {
          const candidateName =
            application.candidate ||
            `${application.firstName || ""} ${application.lastName || ""}`.trim() ||
            "Candidate";

          await logActivity({
            type: "application_status_changed",
            title: "Status updated",
            description: `${candidateName}'s application was marked as new`,
            entityType: "application",
            entityId: application._id,
            actorId: null,
            metadata: {
              candidateName,
              status: "new",
              previousStatus,
            },
          });
        }
      }
    }

    await application.save();

    return NextResponse.json({
      success: true,
      application: serializeApplication(application),
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/applications/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application." },
      { status: 500 }
    );
  }
}
