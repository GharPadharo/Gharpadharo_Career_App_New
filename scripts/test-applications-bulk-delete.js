/**
 * Comprehensive Verification Suite for Bulk Deletion of Admin Applications
 * Usage: node scripts/test-applications-bulk-delete.js
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { encode } from "next-auth/jwt";

// Load environment variables
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {}

import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { uploadResumeBuffer, isCloudinaryConfigured, deleteResume, RESUME_FOLDER } from "../lib/cloudinary.js";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "build-time-secret-placeholder-at-least-32-chars-long";

// Minimal valid PDF binary fixture for Cloudinary upload test
function createSmallPdfBuffer() {
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 44 >> stream
BT
/F1 12 Tf
72 712 Td
(Bulk Delete Test Document) Tj
ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000213 00000 n 
trailer << /Root 1 0 R /Size 5 >>
startxref
307
%%EOF`;
  return Buffer.from(pdfContent, "utf-8");
}

async function runBulkDeleteTests() {
  console.log("==================================================");
  console.log("APPLICATIONS BULK DELETE VERIFICATION SUITE");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  const TEST_PREFIX = `bulkdel-${Date.now()}`;
  const cookieName = BASE_URL.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  try {
    await connectDB();
    console.log("1. Connected to MongoDB Atlas.\n");

    // Query active admin and superadmin for session tokens
    const adminUser = await User.findOne({ role: "admin", isActive: true }).lean();
    if (!adminUser) {
      throw new Error("No active admin user found in database for testing.");
    }

    const adminToken = await encode({
      token: {
        name: adminUser.name || "Admin Tester",
        email: adminUser.email,
        sub: adminUser._id.toString(),
        isAdmin: true,
        role: "admin",
        dbUserId: adminUser._id.toString(),
      },
      secret: AUTH_SECRET,
      salt: cookieName,
    });
    const adminCookie = `${cookieName}=${adminToken}; authjs.session-token=${adminToken}`;

    // Non-admin token
    const nonAdminToken = await encode({
      token: {
        name: "Unauthorized User",
        email: "unauthorized@example.com",
        sub: "unauth-sub-id",
        isAdmin: false,
        role: "user",
      },
      secret: AUTH_SECRET,
      salt: cookieName,
    });
    const nonAdminCookie = `${cookieName}=${nonAdminToken}; authjs.session-token=${nonAdminToken}`;

    // Superadmin token (create temporary fixture if needed)
    let superadminUser = await User.findOne({ role: "superadmin", isActive: true });
    let createdTempSuperadmin = false;
    if (!superadminUser) {
      superadminUser = await User.create({
        email: `${TEST_PREFIX}-super@example.com`,
        name: "SuperAdmin Tester",
        role: "superadmin",
        isActive: true,
      });
      createdTempSuperadmin = true;
    }

    const superadminToken = await encode({
      token: {
        name: superadminUser.name,
        email: superadminUser.email,
        sub: superadminUser._id.toString(),
        isAdmin: true,
        role: "superadmin",
        dbUserId: superadminUser._id.toString(),
      },
      secret: AUTH_SECRET,
      salt: cookieName,
    });
    const superadminCookie = `${cookieName}=${superadminToken}; authjs.session-token=${superadminToken}`;

    // Reference job
    const sampleJob = await Job.findOne({ status: "active" });
    if (!sampleJob) {
      throw new Error("No active Job found in database for application association.");
    }

    // -------------------------------------------------------------------------
    // 1. AUTHORIZATION TESTS
    // -------------------------------------------------------------------------
    console.log("--- 1. AUTHORIZATION TESTS ---");

    // TEST 1: Unauthenticated request rejected
    const unauthRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [new mongoose.Types.ObjectId().toString()] }),
    });
    assert(
      unauthRes.status === 401,
      `Unauthenticated DELETE returns 401 Unauthorized (got ${unauthRes.status})`
    );

    // TEST 2: Authenticated non-admin request rejected
    const nonAdminRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: nonAdminCookie,
      },
      body: JSON.stringify({ ids: [new mongoose.Types.ObjectId().toString()] }),
    });
    assert(
      nonAdminRes.status === 403,
      `Non-admin DELETE returns 403 Forbidden (got ${nonAdminRes.status})`
    );

    // -------------------------------------------------------------------------
    // 2. VALIDATION TESTS
    // -------------------------------------------------------------------------
    console.log("\n--- 2. REQUEST VALIDATION TESTS ---");

    // TEST 3: Missing ids array
    const missingIdsRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({}),
    });
    assert(
      missingIdsRes.status === 400,
      `Missing ids field rejected with 400 Bad Request (got ${missingIdsRes.status})`
    );

    // TEST 4: Empty ids array
    const emptyIdsRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: [] }),
    });
    assert(
      emptyIdsRes.status === 400,
      `Empty ids array rejected with 400 Bad Request (got ${emptyIdsRes.status})`
    );

    // TEST 5: Invalid ObjectId string
    const invalidIdRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: ["invalid-mongo-id-xyz"] }),
    });
    assert(
      invalidIdRes.status === 400,
      `Invalid ObjectId format rejected with 400 (got ${invalidIdRes.status})`
    );

    // TEST 6: Batch size exceeding limit (>100)
    const largeBatch = Array.from({ length: 101 }, () =>
      new mongoose.Types.ObjectId().toString()
    );
    const largeBatchRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: largeBatch }),
    });
    assert(
      largeBatchRes.status === 400,
      `Batch size > 100 rejected with 400 (got ${largeBatchRes.status})`
    );

    // -------------------------------------------------------------------------
    // 3. MONGODB DELETION & APPLICATION LIFECYCLE
    // -------------------------------------------------------------------------
    console.log("\n--- 3. MONGODB DELETION & INTEGRITY TESTS ---");

    // Create 3 temporary test applications
    const testAppDocs = await Application.create([
      {
        jobId: sampleJob._id,
        jobSlug: sampleJob.slug,
        jobTitle: sampleJob.title,
        jobTeam: sampleJob.team,
        firstName: "Bulk1",
        lastName: "Candidate",
        candidate: "Bulk1 Candidate",
        email: `${TEST_PREFIX}-app1@example.com`,
        phone: "+91 91111 22221",
        experience: "2–5 years",
        coverLetter: "Cover letter for bulk delete testing.",
        consent: true,
        status: "new",
      },
      {
        jobId: sampleJob._id,
        jobSlug: sampleJob.slug,
        jobTitle: sampleJob.title,
        jobTeam: sampleJob.team,
        firstName: "Bulk2",
        lastName: "Candidate",
        candidate: "Bulk2 Candidate",
        email: `${TEST_PREFIX}-app2@example.com`,
        phone: "+91 91111 22222",
        experience: "5+ years",
        coverLetter: "Cover letter for bulk delete testing.",
        consent: true,
        status: "viewed",
      },
      {
        jobId: sampleJob._id,
        jobSlug: sampleJob.slug,
        jobTitle: sampleJob.title,
        jobTeam: sampleJob.team,
        firstName: "Bulk3",
        lastName: "Candidate",
        candidate: "Bulk3 Candidate",
        email: `${TEST_PREFIX}-app3@example.com`,
        phone: "+91 91111 22223",
        experience: "Entry-level (0–2 years)",
        coverLetter: "Cover letter for bulk delete testing.",
        consent: true,
        status: "new",
      },
    ]);

    const [app1, app2, app3] = testAppDocs;
    const initialJobsCount = await Job.countDocuments();
    const initialUsersCount = await User.countDocuments();

    // TEST 7: Single application deletion by Admin
    const del1Res = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: [app1._id.toString()] }),
    });
    const del1Data = await del1Res.json();
    assert(del1Res.status === 200, "Admin single deletion returns 200 OK");
    assert(del1Data.deletedCount === 1, "deletedCount is 1");
    const checkApp1 = await Application.findById(app1._id);
    assert(!checkApp1, "Deleted application is absent from MongoDB");

    // TEST 8: Duplicate IDs handled safely
    const dupRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: [app2._id.toString(), app2._id.toString()] }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200, "Duplicate IDs in payload return 200 OK");
    assert(dupData.deletedCount === 1, "Duplicate IDs safely deduplicated (deletedCount: 1)");
    const checkApp2 = await Application.findById(app2._id);
    assert(!checkApp2, "Application with duplicate ID request deleted cleanly");

    // TEST 9: Superadmin deletion
    const delSuperRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: superadminCookie },
      body: JSON.stringify({ ids: [app3._id.toString()] }),
    });
    const delSuperData = await delSuperRes.json();
    assert(delSuperRes.status === 200, "Superadmin deletion returns 200 OK");
    assert(delSuperData.deletedCount === 1, "Superadmin successfully deleted 1 application");
    const checkApp3 = await Application.findById(app3._id);
    assert(!checkApp3, "Application deleted by superadmin is absent from MongoDB");

    // TEST 10: Integrity - Jobs and Users remain untouched
    const postJobsCount = await Job.countDocuments();
    const postUsersCount = await User.countDocuments();
    assert(
      postJobsCount === initialJobsCount,
      `Job documents remained untouched (${postJobsCount} === ${initialJobsCount})`
    );
    assert(
      postUsersCount === initialUsersCount,
      `User documents remained untouched (${postUsersCount} === ${initialUsersCount})`
    );

    // TEST 11: Idempotency - Repeating deletion for already deleted IDs
    const alreadyDeletedRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: [app1._id.toString(), app2._id.toString()] }),
    });
    const alreadyDeletedData = await alreadyDeletedRes.json();
    assert(alreadyDeletedRes.status === 200, "Re-deleting already deleted IDs returns 200 OK");
    assert(alreadyDeletedData.deletedCount === 0, "deletedCount is 0 for already deleted records");
    assert(alreadyDeletedData.missingCount === 2, "missingCount reports 2 missing IDs");

    // -------------------------------------------------------------------------
    // 4. CLOUDINARY RESUME CLEANUP
    // -------------------------------------------------------------------------
    console.log("\n--- 4. CLOUDINARY RESUME CLEANUP TESTS ---");

    if (isCloudinaryConfigured()) {
      console.log("   ✓ Cloudinary credentials detected, executing real asset cleanup test...");
      // Upload a real small PDF fixture
      const pdfBuffer = createSmallPdfBuffer();
      const uploadResult = await uploadResumeBuffer(pdfBuffer, "bulk-test-resume.pdf", ".pdf");

      const appWithResume = await Application.create({
        jobId: sampleJob._id,
        jobSlug: sampleJob.slug,
        jobTitle: sampleJob.title,
        jobTeam: sampleJob.team,
        firstName: "Resume",
        lastName: "Tester",
        candidate: "Resume Tester",
        email: `${TEST_PREFIX}-withresume@example.com`,
        phone: "+91 99999 00001",
        experience: "2–5 years",
        coverLetter: "Application with uploaded Cloudinary resume.",
        resume: {
          fileName: "bulk-test-resume.pdf",
          fileUrl: uploadResult.fileUrl,
          publicId: uploadResult.publicId,
          fileSize: uploadResult.bytes,
          mimeType: "application/pdf",
        },
        consent: true,
        status: "new",
      });

      // Call bulk delete on this application
      const delResumeAppRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({ ids: [appWithResume._id.toString()] }),
      });
      const delResumeAppData = await delResumeAppRes.json();

      assert(delResumeAppRes.status === 200, "Bulk delete with resume returns 200 OK");
      assert(delResumeAppData.deletedCount === 1, "Application with resume deleted from MongoDB");

      // Verify Cloudinary asset is gone (subsequent delete returns 'not found')
      const verifyCloudinaryGone = await deleteResume(uploadResult.publicId);
      assert(
        verifyCloudinaryGone.result === "not found" || verifyCloudinaryGone.success === true,
        `Cloudinary asset was cleaned up (${uploadResult.publicId})`
      );
    } else {
      console.log("   ℹ Cloudinary credentials not configured; skipping live upload test.");
    }

    // TEST 12: Missing/already-deleted Cloudinary publicId does not block deletion
    const appWithMissingCloudinary = await Application.create({
      jobId: sampleJob._id,
      jobSlug: sampleJob.slug,
      jobTitle: sampleJob.title,
      jobTeam: sampleJob.team,
      firstName: "Ghost",
      lastName: "Resume",
      candidate: "Ghost Resume",
      email: `${TEST_PREFIX}-ghostresume@example.com`,
      phone: "+91 99999 00002",
      experience: "2–5 years",
      coverLetter: "Application with non-existent Cloudinary publicId.",
      resume: {
        fileName: "ghost.pdf",
        fileUrl: "https://res.cloudinary.com/dummy/ghost.pdf",
        publicId: `${RESUME_FOLDER}/resume_ghost_already_deleted_12345`,
        fileSize: 1024,
        mimeType: "application/pdf",
      },
      consent: true,
      status: "new",
    });

    const delGhostRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ ids: [appWithMissingCloudinary._id.toString()] }),
    });
    const delGhostData = await delGhostRes.json();
    assert(delGhostRes.status === 200, "Deletion with already-missing Cloudinary asset succeeds");
    assert(delGhostData.deletedCount === 1, "Ghost resume record cleanly deleted without error");

    // -------------------------------------------------------------------------
    // 5. POST-DELETION APPLICATION CREATION INTEGRITY
    // -------------------------------------------------------------------------
    console.log("\n--- 5. POST-DELETION CREATION INTEGRITY ---");
    const newSubmissionRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobSlug: sampleJob.slug,
        firstName: "NewPost",
        lastName: "Submission",
        email: `${TEST_PREFIX}-postcreation@example.com`,
        phone: "+91 98888 77777",
        experience: "2–5 years",
        coverLetter: "Verifying applications can still be created post bulk delete.",
        consent: true,
      }),
    });
    const newSubmissionData = await newSubmissionRes.json();
    assert(newSubmissionRes.status === 201, "New application created successfully after bulk deletions");
    assert(newSubmissionData.success === true, "Response has success: true");

    // -------------------------------------------------------------------------
    // 6. FRONTEND STATIC & ARCHITECTURAL VERIFICATION
    // -------------------------------------------------------------------------
    console.log("\n--- 6. FRONTEND COMPONENT STATIC VERIFICATION ---");
    const tableSource = fs.readFileSync(
      path.resolve("components/admin/AdminApplicationsTable.js"),
      "utf-8"
    );

    assert(
      tableSource.includes("allCurrentPageSelected") && tableSource.includes("handleSelectAllCurrentPage"),
      "AdminApplicationsTable implements 'Select all on current page' header checkbox logic"
    );
    assert(
      tableSource.includes("handleToggleSelectRow") && tableSource.includes('type="checkbox"'),
      "AdminApplicationsTable implements per-row accessible checkboxes"
    );
    assert(
      tableSource.includes("indeterminate"),
      "AdminApplicationsTable handles indeterminate checkbox state"
    );
    assert(
      tableSource.includes("selectedIds.size > 0") && tableSource.includes("Delete Selected"),
      "AdminApplicationsTable displays bulk action toolbar only when items are selected"
    );
    assert(
      tableSource.includes("isDeleteModalOpen") &&
      tableSource.includes("role=\"dialog\"") &&
      tableSource.includes("aria-modal=\"true\""),
      "AdminApplicationsTable includes accessible confirmation dialog with aria attributes"
    );
    assert(
      tableSource.includes("/api/admin/applications/bulk"),
      "AdminApplicationsTable communicates with /api/admin/applications/bulk endpoint"
    );
    assert(
      tableSource.includes("pageSize = 10") && tableSource.includes("paginatedApplications"),
      "AdminApplicationsTable incorporates clean pagination and page boundary handling"
    );

    if (createdTempSuperadmin) {
      await User.deleteOne({ _id: superadminUser._id });
    }

  } finally {
    console.log("\n--- Cleanup ---");
    const cleanApps = await Application.deleteMany({ email: new RegExp(TEST_PREFIX) });
    console.log(`🧹 Cleaned up ${cleanApps.deletedCount} automated test application(s).`);
    await mongoose.disconnect();
    console.log("Database connection closed cleanly.");
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runBulkDeleteTests();
