import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs/[id]
 * 
 * Public endpoint to fetch details of a specific job by its slug (or _id fallback).
 * - Only active and closed jobs are accessible to the public.
 * - Draft jobs return 404 (drafts are private to admins).
 * - Closed jobs return 200 with closed status (public displays "Applications Closed").
 */
export async function GET(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Job ID/slug is required" },
        { status: 400 }
      );
    }

    // Match by slug first, or _id fallback if valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ slug: id }, { _id: id }] } : { slug: id };

    const job = await Job.findOne(query);

    // If job does not exist, or if job is in draft status, return 404 for public requests
    if (!job || job.status === "draft") {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found or not currently available",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    console.error("Error in GET /api/jobs/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve job details. Please try again later.",
      },
      { status: 500 }
    );
  }
}
