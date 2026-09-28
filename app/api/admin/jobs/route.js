import { NextResponse } from "next/server";
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

function generateBaseSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * GET /api/admin/jobs
 * Protected endpoint returning all jobs (active, draft, closed) for admin management.
 */
export async function GET() {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const jobs = await Job.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs: jobs.map(serializeJob),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin jobs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/jobs
 * Protected endpoint to create a new job posting.
 */
export async function POST(request) {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const body = await request.json();

    const {
      title,
      team,
      type = "Full-time",
      experience,
      location,
      workMode = "Remote",
      description,
      responsibilities = [],
      skills = [],
      requirements = [],
      tags = [],
      status = "draft",
    } = body;

    // Server-side validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 }
      );
    }
    if (!team || !team.trim()) {
      return NextResponse.json(
        { success: false, error: "Team is required" },
        { status: 400 }
      );
    }
    if (!VALID_JOB_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid job type. Must be one of: ${VALID_JOB_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!experience || !experience.trim()) {
      return NextResponse.json(
        { success: false, error: "Experience level is required" },
        { status: 400 }
      );
    }
    if (!location || !location.trim()) {
      return NextResponse.json(
        { success: false, error: "Location is required" },
        { status: 400 }
      );
    }
    if (!VALID_WORK_MODES.includes(workMode)) {
      return NextResponse.json(
        { success: false, error: `Invalid work mode. Must be one of: ${VALID_WORK_MODES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!description || !description.trim()) {
      return NextResponse.json(
        { success: false, error: "Job description is required" },
        { status: 400 }
      );
    }

    const normalizedStatus = (status || "draft").toLowerCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Slug generation and collision resolution
    let baseSlug = generateBaseSlug(title);
    if (!baseSlug) {
      baseSlug = `job-${Date.now()}`;
    }

    let slug = baseSlug;
    let existing = await Job.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      existing = await Job.findOne({ slug });
    }

    // Find admin user document for audit linkage
    let adminUserId = undefined;
    if (authResult.user.email) {
      const adminDoc = await User.findOne({ email: authResult.user.email.toLowerCase() });
      if (adminDoc) {
        adminUserId = adminDoc._id;
      }
    }

    const cleanArray = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
        : [];

    const newJob = await Job.create({
      slug,
      title: title.trim(),
      team: team.trim(),
      type,
      experience: experience.trim(),
      location: location.trim(),
      workMode,
      description: description.trim(),
      responsibilities: cleanArray(responsibilities),
      skills: cleanArray(skills),
      requirements: cleanArray(requirements),
      tags: cleanArray(tags).length > 0 ? cleanArray(tags) : cleanArray(skills),
      status: normalizedStatus,
      postedAt: normalizedStatus === "active" ? new Date() : new Date(),
      createdById: adminUserId,
      updatedById: adminUserId,
    });

    await logActivity({
      type: "job_created",
      title: "Job created",
      description: `${newJob.title} position was created`,
      entityType: "job",
      entityId: newJob._id,
      actorId: adminUserId || null,
      metadata: {
        jobTitle: newJob.title,
        jobSlug: newJob.slug,
        team: newJob.team,
        status: newJob.status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        job: serializeJob(newJob),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
