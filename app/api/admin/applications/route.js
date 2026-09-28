import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { requireAdminAuth } from "@/lib/authGuard";
import { serializeApplication } from "@/lib/applicationSerializer";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/applications
 * 
 * Protected admin endpoint returning candidate applications from MongoDB:
 * - Guarded by requireAdminAuth()
 * - Newest applications first (createdAt: -1)
 * - Supports pagination (page, limit)
 * - Supports status filter (?status=new|viewed|all)
 * - Supports job filter (?jobId=... or ?jobSlug=...)
 * - Supports search (?search=...) matching candidate, email, or jobTitle
 */
export async function GET(request) {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const status = searchParams.get("status") || "all";
    const jobFilter = searchParams.get("jobId") || searchParams.get("jobSlug") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const query = {};

    if (status && status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    const typeFilter = searchParams.get("type") || searchParams.get("applicationType") || "";

    if (typeFilter && typeFilter.toLowerCase() !== "all") {
      query.applicationType = typeFilter.toLowerCase();
    } else if (jobFilter === "general" || jobFilter.toLowerCase() === "general") {
      query.applicationType = "general";
    } else if (jobFilter && jobFilter !== "All" && jobFilter.toLowerCase() !== "all") {
      query.$or = [{ jobSlug: jobFilter }, { jobTitle: jobFilter }];
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        ...(query.$or || []),
        { candidate: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { jobTitle: searchRegex },
        { jobTeam: searchRegex },
        { opportunityLookingFor: searchRegex },
        { aboutYourself: searchRegex },
      ];
    }

    const [total, applications] = await Promise.all([
      Application.countDocuments(query),
      Application.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      count: applications.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      applications: applications.map(serializeApplication),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}
