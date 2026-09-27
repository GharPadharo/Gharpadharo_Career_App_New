import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs
 * 
 * Public endpoint to fetch all active career positions.
 * - Only returns jobs with status: "active"
 * - Supports optional query filters: search, team, type, experience
 * - Returns serialized data with computed postedText and slug-as-id
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const team = searchParams.get("team") || "";
    const type = searchParams.get("type") || "";
    const experience = searchParams.get("experience") || "";

    const query = { status: "active" };

    if (team && team.toLowerCase() !== "all") {
      query.team = team;
    }

    if (type && type.toLowerCase() !== "all") {
      query.type = type;
    }

    if (experience && experience.toLowerCase() !== "all") {
      query.experience = experience;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { team: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    const jobs = await Job.find(query).sort({ postedAt: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs: jobs.map(serializeJob),
    });
  } catch (error) {
    console.error("Error in GET /api/jobs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve job listings. Please try again later.",
      },
      { status: 500 }
    );
  }
}
