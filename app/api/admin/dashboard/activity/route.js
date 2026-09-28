import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { requireAdminAuth } from "@/lib/authGuard";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 15;
const MAX_LIMIT = 50;

/**
 * GET /api/admin/dashboard/activity
 * 
 * Protected admin endpoint returning real-time recruitment activities from MongoDB:
 * - Requires authenticated admin/superadmin session
 * - Sorted newest first (createdAt: -1)
 * - Safe field projection (no sensitive credentials or candidate PII)
 * - Configurable limit with hard boundary
 */
export async function GET(request) {
  // 1. Enforce admin authorization
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    await connectDB();

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10);
    const limit = Math.min(Math.max(1, isNaN(limitParam) ? DEFAULT_LIMIT : limitParam), MAX_LIMIT);

    // 3. Query activities
    const activitiesDocs = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // 4. Sanitize and serialize response
    const activities = activitiesDocs.map((act) => ({
      id: act._id?.toString() || "",
      type: act.type,
      title: act.title,
      description: act.description,
      entityType: act.entityType,
      entityId: act.entityId ? act.entityId.toString() : null,
      metadata: act.metadata || {},
      createdAt: act.createdAt ? new Date(act.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/dashboard/activity:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve recruitment activity",
      },
      { status: 500 }
    );
  }
}
