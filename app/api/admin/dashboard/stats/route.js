import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { requireAdminAuth } from "@/lib/authGuard";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/dashboard/stats
 * 
 * Protected server-side endpoint providing real-time platform statistics from MongoDB:
 * - Jobs counts: total, active, draft, closed
 * - Applications counts: total, new, viewed
 * - Recent 5 applications (summary fields only, no sensitive personal data)
 * - Recent 5 jobs (summary fields only)
 */
export async function GET() {
  // 1. Enforce admin authentication & authorization
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    // 2. Query counts and recent records in parallel with minimal footprint
    const [
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      newApplications,
      viewedApplications,
      recentApplicationsDocs,
      recentJobsDocs,
    ] = await Promise.all([
      Job.countDocuments({}),
      Job.countDocuments({ status: "active" }),
      Job.countDocuments({ status: "draft" }),
      Job.countDocuments({ status: "closed" }),
      Application.countDocuments({}),
      Application.countDocuments({ status: "new" }),
      Application.countDocuments({ status: "viewed" }),
      Application.find({})
        .select("_id candidate firstName lastName email jobTitle jobSlug applicationType status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Job.find({})
        .select("_id slug title team location type status createdAt postedAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // 3. Serialize recent applications (strictly safe summary fields, no resumes, phones, or cover letters)
    const recentApplications = recentApplicationsDocs.map((app) => ({
      id: app._id?.toString() || "",
      candidate:
        app.candidate ||
        `${app.firstName || ""} ${app.lastName || ""}`.trim() ||
        "Applicant",
      email: (app.email || "").toLowerCase().trim(),
      jobTitle:
        app.jobTitle ||
        (app.applicationType === "general" || !app.jobSlug
          ? "General Application"
          : "Position"),
      jobSlug: app.jobSlug || "general-application",
      status: app.status || "new",
      createdAt: app.createdAt
        ? new Date(app.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    // 4. Serialize recent jobs
    const recentJobs = recentJobsDocs.map((job) => ({
      id: job.slug || job._id?.toString() || "",
      slug: job.slug || "",
      title: job.title || "",
      team: job.team || "",
      location: job.location || "",
      type: job.type || "Full-time",
      status: job.status || "draft",
      createdAt: job.createdAt
        ? new Date(job.createdAt).toISOString()
        : new Date().toISOString(),
      postedAt: job.postedAt
        ? new Date(job.postedAt).toISOString()
        : undefined,
    }));

    const statsData = {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        draft: draftJobs,
        closed: closedJobs,
      },
      applications: {
        total: totalApplications,
        new: newApplications,
        viewed: viewedApplications,
      },
      recentApplications,
      recentJobs,
    };

    return NextResponse.json({
      success: true,
      data: statsData,
      // Top-level aliases for direct destructuring convenience
      jobs: statsData.jobs,
      applications: statsData.applications,
      recentApplications,
      recentJobs,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/dashboard/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve dashboard statistics from database",
      },
      { status: 500 }
    );
  }
}
