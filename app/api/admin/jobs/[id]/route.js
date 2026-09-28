import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { requireAdminAuth } from "@/lib/authGuard";
import { serializeJob } from "@/lib/jobSerializer";
import { logActivity } from "@/lib/activityLogger";

export const dynamic = "force-dynamic";

const VALID_JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const VALID_WORK_MODES = ["Remote", "Hybrid", "On-site"];
const VALID_STATUSES = ["active", "draft", "closed"];

function findJobQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ slug: id }, { _id: id }] };
  }
  return { slug: id };
}

/**
 * GET /api/admin/jobs/[id]
 * Fetch a single job by slug or ID for admin inspection/editing.
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

    const job = await Job.findOne(findJobQuery(id));
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/jobs/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/jobs/[id]
 * Update an existing job's details or status.
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

    const job = await Job.findOne(findJobQuery(id));
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Whitelist updates
    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { success: false, error: "Job title cannot be empty" },
          { status: 400 }
        );
      }
      job.title = body.title.trim();
    }

    if (body.team !== undefined) {
      if (!body.team.trim()) {
        return NextResponse.json(
          { success: false, error: "Team cannot be empty" },
          { status: 400 }
        );
      }
      job.team = body.team.trim();
    }

    if (body.type !== undefined) {
      if (!VALID_JOB_TYPES.includes(body.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid job type: ${body.type}` },
          { status: 400 }
        );
      }
      job.type = body.type;
    }

    if (body.experience !== undefined) {
      if (!body.experience.trim()) {
        return NextResponse.json(
          { success: false, error: "Experience cannot be empty" },
          { status: 400 }
        );
      }
      job.experience = body.experience.trim();
    }

    if (body.location !== undefined) {
      if (!body.location.trim()) {
        return NextResponse.json(
          { success: false, error: "Location cannot be empty" },
          { status: 400 }
        );
      }
      job.location = body.location.trim();
    }

    if (body.workMode !== undefined) {
      if (!VALID_WORK_MODES.includes(body.workMode)) {
        return NextResponse.json(
          { success: false, error: `Invalid work mode: ${body.workMode}` },
          { status: 400 }
        );
      }
      job.workMode = body.workMode;
    }

    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json(
          { success: false, error: "Description cannot be empty" },
          { status: 400 }
        );
      }
      job.description = body.description.trim();
    }

    const cleanArray = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
        : [];

    if (body.responsibilities !== undefined) {
      job.responsibilities = cleanArray(body.responsibilities);
    }

    if (body.skills !== undefined) {
      job.skills = cleanArray(body.skills);
    }

    if (body.requirements !== undefined) {
      job.requirements = cleanArray(body.requirements);
    }

    if (body.tags !== undefined) {
      job.tags = cleanArray(body.tags);
    } else if (body.skills !== undefined && (!job.tags || job.tags.length === 0)) {
      job.tags = cleanArray(body.skills);
    }

    const previousStatus = job.status;
    let statusChanged = false;
    let normalizedStatus = previousStatus;

    if (body.status !== undefined) {
      normalizedStatus = body.status.toLowerCase();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return NextResponse.json(
          { success: false, error: `Invalid status: ${body.status}` },
          { status: 400 }
        );
      }

      if (normalizedStatus !== previousStatus) {
        statusChanged = true;
        // If moving to active from another status, refresh postedAt
        if (normalizedStatus === "active") {
          job.postedAt = new Date();
        }
        job.status = normalizedStatus;
      }
    }

    // Attach updatedById audit
    let adminDoc = null;
    if (authResult.user.email) {
      adminDoc = await User.findOne({ email: authResult.user.email.toLowerCase() });
      if (adminDoc) {
        job.updatedById = adminDoc._id;
      }
    }

    await job.save();

    // Log appropriate activity event
    if (statusChanged) {
      if (previousStatus === "draft" && normalizedStatus === "active") {
        await logActivity({
          type: "job_published",
          title: "Job published",
          description: `${job.title} position was published`,
          entityType: "job",
          entityId: job._id,
          actorId: adminDoc?._id || null,
          metadata: {
            jobTitle: job.title,
            jobSlug: job.slug,
            previousStatus,
            status: normalizedStatus,
          },
        });
      } else if (previousStatus === "active" && normalizedStatus === "closed") {
        await logActivity({
          type: "job_closed",
          title: "Job closed",
          description: `${job.title} position was closed`,
          entityType: "job",
          entityId: job._id,
          actorId: adminDoc?._id || null,
          metadata: {
            jobTitle: job.title,
            jobSlug: job.slug,
            previousStatus,
            status: normalizedStatus,
          },
        });
      } else if (previousStatus === "closed" && normalizedStatus === "active") {
        await logActivity({
          type: "job_reopened",
          title: "Job reopened",
          description: `${job.title} position was reopened`,
          entityType: "job",
          entityId: job._id,
          actorId: adminDoc?._id || null,
          metadata: {
            jobTitle: job.title,
            jobSlug: job.slug,
            previousStatus,
            status: normalizedStatus,
          },
        });
      } else {
        await logActivity({
          type: "job_updated",
          title: "Job status changed",
          description: `${job.title} position moved to ${normalizedStatus}`,
          entityType: "job",
          entityId: job._id,
          actorId: adminDoc?._id || null,
          metadata: {
            jobTitle: job.title,
            jobSlug: job.slug,
            previousStatus,
            status: normalizedStatus,
          },
        });
      }
    } else {
      // Check if material content changed (title, description, requirements, etc.)
      const materialKeys = [
        "title",
        "team",
        "type",
        "experience",
        "location",
        "workMode",
        "description",
        "responsibilities",
        "skills",
        "requirements",
        "tags",
      ];
      const hasMaterialChanges = materialKeys.some((k) => body[k] !== undefined);
      if (hasMaterialChanges) {
        await logActivity({
          type: "job_updated",
          title: "Job updated",
          description: `${job.title} details were updated`,
          entityType: "job",
          entityId: job._id,
          actorId: adminDoc?._id || null,
          metadata: {
            jobTitle: job.title,
            jobSlug: job.slug,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/jobs/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/jobs/[id]
 * Delete a job permanently.
 */
export async function DELETE(request, context) {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    const deleted = await Job.findOneAndDelete(findJobQuery(id));
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Job '${deleted.title}' (${deleted.slug}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/jobs/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
