import fs from "fs";
import path from "path";
import { encode } from "next-auth/jwt";
import mongoose from "mongoose";

// 1. Load environment variables from .env.local
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
} catch (e) {
  // Ignore
}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "build-time-secret-placeholder-at-least-32-chars-long";

async function runTests() {
  console.log("==================================================");
  console.log("RECRUITMENT ACTIVITY SYSTEM VERIFICATION SUITE");
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

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  }

  // Import models
  const ActivityModule = await import("../models/Activity.js");
  const ActivityModel = ActivityModule.default;

  const JobModule = await import("../models/Job.js");
  const JobModel = JobModule.default;

  const ApplicationModule = await import("../models/Application.js");
  const ApplicationModel = ApplicationModule.default;

  const UserModule = await import("../models/User.js");
  const UserModel = UserModule.default;

  const dbAdmin = await UserModel.findOne({ role: "admin", isActive: true }).lean();
  if (!dbAdmin) {
    throw new Error("No active admin user found in MongoDB for testing!");
  }

  // Generate tokens
  const cookieName = BASE_URL.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const adminToken = await encode({
    token: {
      name: dbAdmin.name || "Admin Tester",
      email: dbAdmin.email,
      sub: dbAdmin._id.toString(),
      isAdmin: true,
      role: "admin",
      dbUserId: dbAdmin._id.toString(),
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });
  const adminCookieHeader = `${cookieName}=${adminToken}; authjs.session-token=${adminToken}`;

  // Superadmin token (create temporary fixture if needed)
  let superadminUser = await UserModel.findOne({ role: "superadmin", isActive: true });
  let createdTempSuperadmin = false;
  if (!superadminUser) {
    superadminUser = await UserModel.create({
      email: `activity-superadmin-${Date.now()}@example.com`,
      name: "SuperAdmin Tester",
      role: "superadmin",
      isActive: true,
    });
    createdTempSuperadmin = true;
  }

  const superadminToken = await encode({
    token: {
      name: superadminUser.name || "SuperAdmin Tester",
      email: superadminUser.email,
      sub: superadminUser._id.toString(),
      isAdmin: true,
      role: "superadmin",
      dbUserId: superadminUser._id.toString(),
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });
  const superadminCookieHeader = `${cookieName}=${superadminToken}; authjs.session-token=${superadminToken}`;

  const nonAdminToken = await encode({
    token: {
      name: "Normal User",
      email: "user@gharpadharo.com",
      sub: new mongoose.Types.ObjectId().toString(),
      isAdmin: false,
      role: "user",
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });
  const nonAdminCookieHeader = `${cookieName}=${nonAdminToken}; authjs.session-token=${nonAdminToken}`;

  // Keep track of test IDs to cleanly delete at end
  const createdActivityIds = [];
  const createdAppIds = [];
  const createdJobIds = [];

  try {
    // ----------------------------------------------------
    // 1. ACTIVITY MODEL TESTS
    // ----------------------------------------------------
    console.log("--- 1. Activity Model Verification ---");

    // Test 1: Valid activity document creation
    const testAct = await ActivityModel.create({
      type: "application_created",
      title: "Test Activity",
      description: "Candidate applied for role",
      entityType: "application",
      metadata: { role: "Engineer" },
    });
    createdActivityIds.push(testAct._id);
    assert(testAct && testAct._id, "Activity document can be created successfully in MongoDB");

    // Test 2: Validation of required fields
    let validationFailed = false;
    try {
      await ActivityModel.create({
        type: "application_created",
        // missing title, description, entityType
      });
    } catch {
      validationFailed = true;
    }
    assert(validationFailed, "Activity schema validates required fields (title, description, entityType)");

    // Test 3: Invalid type rejection
    let invalidTypeFailed = false;
    try {
      await ActivityModel.create({
        type: "invalid_unsupported_type",
        title: "Invalid",
        description: "Invalid",
        entityType: "job",
      });
    } catch {
      invalidTypeFailed = true;
    }
    assert(invalidTypeFailed, "Activity schema rejects invalid activity type enum");

    // Test 4: createdAt is stored as Date
    assert(testAct.createdAt instanceof Date, "Activity createdAt is stored correctly as a Date");

    // ----------------------------------------------------
    // 2. AUTHORIZATION TESTS
    // ----------------------------------------------------
    console.log("\n--- 2. Activity API Authorization ---");

    // Test 5: Unauthenticated request returns 401
    const unauthRes = await fetch(`${BASE_URL}/api/admin/dashboard/activity`);
    assert(unauthRes.status === 401, `Unauthenticated request returns 401 (got ${unauthRes.status})`);

    // Test 6: Non-admin request returns 403
    const nonAdminRes = await fetch(`${BASE_URL}/api/admin/dashboard/activity`, {
      headers: { Cookie: nonAdminCookieHeader },
    });
    assert(nonAdminRes.status === 403, `Non-admin request returns 403 (got ${nonAdminRes.status})`);

    // Test 7: Admin request returns 200
    const adminRes = await fetch(`${BASE_URL}/api/admin/dashboard/activity`, {
      headers: { Cookie: adminCookieHeader },
    });
    assert(adminRes.status === 200, `Admin request returns 200 (got ${adminRes.status})`);

    // Test 8: Superadmin request returns 200
    const superadminRes = await fetch(`${BASE_URL}/api/admin/dashboard/activity`, {
      headers: { Cookie: superadminCookieHeader },
    });
    assert(superadminRes.status === 200, `Superadmin request returns 200 (got ${superadminRes.status})`);

    // ----------------------------------------------------
    // 3. APPLICATION EVENT LOGGING TESTS
    // ----------------------------------------------------
    console.log("\n--- 3. Application Event Logging ---");

    // Test 9: Public job application submission logs application_created
    const testCandidateEmail = `test.activity.applicant.${Date.now()}@example.com`;
    const appRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobSlug: "full-stack-developer",
        firstName: "Rohan",
        lastName: "Verma",
        email: testCandidateEmail,
        phone: "+91 9876543210",
        experience: "3 years",
        coverLetter: "Excited about this opportunity.",
        consent: true,
      }),
    });
    const appJson = await appRes.json();
    assert(appRes.status === 201, `Application submitted successfully (got ${appRes.status})`);
    if (appJson.application?.id) {
      createdAppIds.push(new mongoose.Types.ObjectId(appJson.application.id));
    }

    const appCreatedAct = await ActivityModel.findOne({
      type: "application_created",
      "metadata.candidateName": "Rohan Verma",
    }).lean();
    if (appCreatedAct) createdActivityIds.push(appCreatedAct._id);
    assert(
      appCreatedAct && appCreatedAct.description.includes("Rohan Verma applied for Full Stack Developer"),
      "New job application automatically generates application_created activity event"
    );

    // Test 10: General application submission logs application_created
    const genAppEmail = `test.activity.general.${Date.now()}@example.com`;
    const genRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Meera",
        lastName: "Nair",
        email: genAppEmail,
        opportunityLookingFor: "Marketing or Growth",
        resume: {
          fileName: "meera_resume.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://res.cloudinary.com/dummy/meera.pdf",
        },
        consent: true,
      }),
    });
    const genJson = await genRes.json();
    assert(genRes.status === 201, `General application submitted successfully (got ${genRes.status})`);
    if (genJson.application?.id) {
      createdAppIds.push(new mongoose.Types.ObjectId(genJson.application.id));
    }

    const genCreatedAct = await ActivityModel.findOne({
      type: "application_created",
      "metadata.candidateName": "Meera Nair",
    }).lean();
    if (genCreatedAct) createdActivityIds.push(genCreatedAct._id);
    assert(
      genCreatedAct && genCreatedAct.description.includes("Meera Nair submitted a general application"),
      "General application submission generates application_created activity event"
    );

    // Test 11: Viewing application (new -> viewed) logs application_viewed
    const viewRes = await fetch(`${BASE_URL}/api/admin/applications/${appJson.application.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ status: "viewed" }),
    });
    assert(viewRes.status === 200, `Application marked as viewed (got ${viewRes.status})`);

    const appViewedAct = await ActivityModel.findOne({
      type: "application_viewed",
      entityId: new mongoose.Types.ObjectId(appJson.application.id),
    }).lean();
    if (appViewedAct) createdActivityIds.push(appViewedAct._id);
    assert(
      appViewedAct && appViewedAct.description.includes("Rohan Verma's application was viewed"),
      "Viewing application creates application_viewed event with safe narrative description"
    );

    // Test 12: Idempotent viewed check (repeating PATCH status: viewed does not duplicate event)
    const initialViewedCount = await ActivityModel.countDocuments({
      type: "application_viewed",
      entityId: new mongoose.Types.ObjectId(appJson.application.id),
    });
    await fetch(`${BASE_URL}/api/admin/applications/${appJson.application.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ status: "viewed" }),
    });
    const afterViewedCount = await ActivityModel.countDocuments({
      type: "application_viewed",
      entityId: new mongoose.Types.ObjectId(appJson.application.id),
    });
    assert(
      initialViewedCount === 1 && afterViewedCount === 1,
      "Re-saving an already-viewed application does NOT log duplicate application_viewed activity"
    );

    // ----------------------------------------------------
    // 4. JOB EVENT LOGGING TESTS
    // ----------------------------------------------------
    console.log("\n--- 4. Job Event Logging ---");

    // Test 13: Job creation logs job_created
    const uniqueJobTitle = `Temporary Test Role ${Date.now()}`;
    const jobCreateRes = await fetch(`${BASE_URL}/api/admin/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({
        title: uniqueJobTitle,
        team: "Engineering",
        type: "Full-time",
        experience: "Mid-level",
        location: "Remote",
        workMode: "Remote",
        description: "Job for testing activity logging.",
        status: "draft",
      }),
    });
    const jobCreateJson = await jobCreateRes.json();
    assert(jobCreateRes.status === 201, `Temporary job created (got ${jobCreateRes.status})`);
    const tempJobSlug = jobCreateJson.job?.slug;
    const tempJobDbId = jobCreateJson.job?._id;
    if (tempJobDbId) createdJobIds.push(new mongoose.Types.ObjectId(tempJobDbId));

    const jobCreatedAct = await ActivityModel.findOne({
      type: "job_created",
      "metadata.jobTitle": uniqueJobTitle,
    }).lean();
    if (jobCreatedAct) createdActivityIds.push(jobCreatedAct._id);
    assert(
      jobCreatedAct && jobCreatedAct.description.includes(`${uniqueJobTitle} position was created`),
      "Job creation generates job_created activity event"
    );

    // Test 14: Draft -> Active logs job_published
    const publishRes = await fetch(`${BASE_URL}/api/admin/jobs/${tempJobSlug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ status: "active" }),
    });
    assert(publishRes.status === 200, `Job published to active (got ${publishRes.status})`);

    const jobPublishedAct = await ActivityModel.findOne({
      type: "job_published",
      "metadata.jobSlug": tempJobSlug,
    }).lean();
    if (jobPublishedAct) createdActivityIds.push(jobPublishedAct._id);
    assert(
      jobPublishedAct && jobPublishedAct.description.includes(`${uniqueJobTitle} position was published`),
      "Transition from draft to active generates job_published activity event"
    );

    // Test 15: Active -> Closed logs job_closed
    const closeRes = await fetch(`${BASE_URL}/api/admin/jobs/${tempJobSlug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ status: "closed" }),
    });
    assert(closeRes.status === 200, `Job transitioned to closed (got ${closeRes.status})`);

    const jobClosedAct = await ActivityModel.findOne({
      type: "job_closed",
      "metadata.jobSlug": tempJobSlug,
    }).lean();
    if (jobClosedAct) createdActivityIds.push(jobClosedAct._id);
    assert(
      jobClosedAct && jobClosedAct.description.includes(`${uniqueJobTitle} position was closed`),
      "Transition from active to closed generates job_closed activity event"
    );

    // Test 16: Closed -> Active logs job_reopened
    const reopenRes = await fetch(`${BASE_URL}/api/admin/jobs/${tempJobSlug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ status: "active" }),
    });
    assert(reopenRes.status === 200, `Job reopened to active (got ${reopenRes.status})`);

    const jobReopenedAct = await ActivityModel.findOne({
      type: "job_reopened",
      "metadata.jobSlug": tempJobSlug,
    }).lean();
    if (jobReopenedAct) createdActivityIds.push(jobReopenedAct._id);
    assert(
      jobReopenedAct && jobReopenedAct.description.includes(`${uniqueJobTitle} position was reopened`),
      "Transition from closed to active generates job_reopened activity event"
    );

    // Test 17: Material update logs job_updated
    const updateRes = await fetch(`${BASE_URL}/api/admin/jobs/${tempJobSlug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ description: "Updated description for testing." }),
    });
    assert(updateRes.status === 200, `Job description updated (got ${updateRes.status})`);

    const jobUpdatedAct = await ActivityModel.findOne({
      type: "job_updated",
      "metadata.jobSlug": tempJobSlug,
    }).lean();
    if (jobUpdatedAct) createdActivityIds.push(jobUpdatedAct._id);
    assert(
      jobUpdatedAct && jobUpdatedAct.description.includes(`${uniqueJobTitle} details were updated`),
      "Material job field update generates job_updated activity event"
    );

    // ----------------------------------------------------
    // 5. APPLICATION DELETION LOGGING TESTS
    // ----------------------------------------------------
    console.log("\n--- 5. Application Deletion Logging ---");

    // Test 18: Single application deletion logs application_deleted
    const singleDeleteRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ ids: [appJson.application.id] }),
    });
    assert(singleDeleteRes.status === 200, `Single application deleted (got ${singleDeleteRes.status})`);

    const singleDeletedAct = await ActivityModel.findOne({
      type: "application_deleted",
      entityId: new mongoose.Types.ObjectId(appJson.application.id),
    }).lean();
    if (singleDeletedAct) createdActivityIds.push(singleDeletedAct._id);
    assert(
      singleDeletedAct && singleDeletedAct.description.includes("was deleted"),
      "Single application deletion generates informative application_deleted event"
    );

    // Test 19: Bulk deletion summary representation
    // Create 2 temporary applications to delete together
    const tempApp1 = await ApplicationModel.create({
      applicationType: "general",
      firstName: "Bulk1",
      lastName: "Tester",
      candidate: "Bulk1 Tester",
      email: `bulk1.${Date.now()}@example.com`,
      consent: true,
      status: "new",
    });
    const tempApp2 = await ApplicationModel.create({
      applicationType: "general",
      firstName: "Bulk2",
      lastName: "Tester",
      candidate: "Bulk2 Tester",
      email: `bulk2.${Date.now()}@example.com`,
      consent: true,
      status: "new",
    });

    const bulkDeleteRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({ ids: [tempApp1._id.toString(), tempApp2._id.toString()] }),
    });
    assert(bulkDeleteRes.status === 200, `Bulk applications deleted (got ${bulkDeleteRes.status})`);

    const bulkDeletedAct = await ActivityModel.findOne({
      type: "application_deleted",
      "metadata.deletedCount": 2,
    }).lean();
    if (bulkDeletedAct) createdActivityIds.push(bulkDeletedAct._id);
    assert(
      bulkDeletedAct && bulkDeletedAct.description === "2 applications were deleted",
      "Bulk deletion produces a single summarized activity entry (prevents feed flooding)"
    );

    // Clean up general app from earlier
    await ApplicationModel.deleteOne({ _id: new mongoose.Types.ObjectId(genJson.application.id) });

    // ----------------------------------------------------
    // 6. ACTIVITY API ORDERING & SANITIZATION TESTS
    // ----------------------------------------------------
    console.log("\n--- 6. Activity API Ordering & Sanitization ---");

    const feedRes = await fetch(`${BASE_URL}/api/admin/dashboard/activity?limit=5`, {
      headers: { Cookie: adminCookieHeader },
    });
    const feedJson = await feedRes.json();
    assert(feedRes.status === 200, `GET /api/admin/dashboard/activity returns 200 OK`);
    assert(feedJson.success === true, `Response has success: true`);
    assert(Array.isArray(feedJson.activities), `Response returns activities array`);
    assert(feedJson.activities.length <= 5, `Limit query parameter is enforced (count: ${feedJson.activities.length})`);

    // Test chronological ordering: newest first
    let isChronological = true;
    for (let i = 0; i < feedJson.activities.length - 1; i++) {
      const current = new Date(feedJson.activities[i].createdAt).getTime();
      const next = new Date(feedJson.activities[i + 1].createdAt).getTime();
      if (current < next) {
        isChronological = false;
        break;
      }
    }
    assert(isChronological, "Activities are returned chronologically in descending order (newest first)");

    // Test privacy: no sensitive fields
    const sensitiveKeys = ["phone", "resume", "fileUrl", "publicId", "password", "token", "secret", "coverLetter"];
    let hasSensitiveData = false;
    for (const act of feedJson.activities) {
      for (const key of sensitiveKeys) {
        if (act[key] !== undefined || act.metadata?.[key] !== undefined) {
          hasSensitiveData = true;
          break;
        }
      }
    }
    assert(!hasSensitiveData, "Activity feed strictly excludes sensitive personal and system credentials");

    // ----------------------------------------------------
    // 7. COMPONENT & UI INTEGRITY CHECKS
    // ----------------------------------------------------
    console.log("\n--- 7. Component & UI Static Integrity ---");

    const cardSource = fs.readFileSync(
      path.resolve(process.cwd(), "components/admin/RecentActivityCard.js"),
      "utf-8"
    );
    assert(
      cardSource.includes("/api/admin/dashboard/activity"),
      "RecentActivityCard fetches directly from /api/admin/dashboard/activity"
    );
    assert(
      cardSource.includes("Live activity"),
      "RecentActivityCard renders 'Live activity' badge indicator"
    );
    assert(
      cardSource.includes("No recent activity"),
      "RecentActivityCard provides intentional empty state handling"
    );
    assert(
      cardSource.includes("Activity couldn't be loaded.") || cardSource.includes("Activity couldn&apos;t be loaded."),
      "RecentActivityCard includes error state with retry button"
    );
    assert(
      cardSource.includes("formatRelativeTime"),
      "RecentActivityCard implements relative time formatting (e.g. 2m ago, 1h ago)"
    );
  } finally {
    // ----------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------
    console.log("\n--- Cleanup ---");

    // Clean up temporary activities
    if (createdActivityIds.length > 0) {
      const delActs = await ActivityModel.deleteMany({ _id: { $in: createdActivityIds } });
      console.log(`🧹 Cleaned up ${delActs.deletedCount} temporary activity document(s).`);
    }

    // Clean up temporary applications
    if (createdAppIds.length > 0) {
      const delApps = await ApplicationModel.deleteMany({ _id: { $in: createdAppIds } });
      console.log(`🧹 Cleaned up ${delApps.deletedCount} temporary application document(s).`);
    }

    // Clean up temporary jobs
    if (createdJobIds.length > 0) {
      const delJobs = await JobModel.deleteMany({ _id: { $in: createdJobIds } });
      console.log(`🧹 Cleaned up ${delJobs.deletedCount} temporary job document(s).`);
    }

    // Clean up temporary superadmin
    if (createdTempSuperadmin && superadminUser?._id) {
      await UserModel.deleteOne({ _id: superadminUser._id });
      console.log(`🧹 Cleaned up temporary superadmin user fixture.`);
    }

    // Verify baseline jobs count remains intact
    const activeJobs = await JobModel.countDocuments({ status: "active" });
    const draftJobs = await JobModel.countDocuments({ status: "draft" });
    const closedJobs = await JobModel.countDocuments({ status: "closed" });
    console.log(`Development Database Job State: ${activeJobs} active, ${draftJobs} draft, ${closedJobs} closed.`);

    await mongoose.disconnect();
    console.log("Database connection closed cleanly.\n");
  }

  console.log("==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
