import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/authGuard";
import { exportSpreadsheetAsXlsx } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/applications/export
 *
 * Protected admin endpoint allowing authorized admins to download
 * the existing integrated Google Sheets spreadsheet as an Excel (.xlsx) file.
 *
 * Security & Guarding:
 * - Requires active admin or superadmin authentication via requireAdminAuth()
 * - Performs server-side Google Service Account authentication
 * - Never exposes OAuth tokens or service account credentials to the client
 */
export async function GET() {
  const authResult = await requireAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const result = await exportSpreadsheetAsXlsx();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to export applications spreadsheet.",
        },
        { status: result.status || 500 }
      );
    }

    return new Response(result.buffer, {
      status: 200,
      headers: {
        "Content-Type":
          result.contentType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${
          result.filename || "GharPadharo_Applications.xlsx"
        }"`,
        "Content-Length": String(result.buffer.byteLength),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Spreadsheet export route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while exporting the spreadsheet.",
      },
      { status: 500 }
    );
  }
}
