import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load .env.local if present
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
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
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
const TEST_EMAIL = "automated.candidate.test@example.com";

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 2E: APPLICATIONS API VERIFICATION SUITE");
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

  // Connect to DB directly for data cleanup and assertions
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });

  const JobModel = mongoose.models.Job || mongoose.model("Job", new mongoose.Schema({}, { strict: false }));
  const ApplicationModel =
    mongoose.models.Application || mongoose.model("Application", new mongoose.Schema({}, { strict: false }));

  // Ensure clean state before starting
  await ApplicationModel.deleteMany({ email: TEST_EMAIL });

  let createdAppId = null;

  try {
    // TEST 1: Public POST /api/applications - Valid application
    console.log("--- 1. Public POST /api/applications - Valid Submission ---");
    const validPayload = {
      jobSlug: "full-stack-developer",
      firstName: "Automated",
      lastName: "Tester",
      email: TEST_EMAIL,
      phone: "+91 99999 88888",
      currentJobTitle: "QA Engineer",
      experience: "2–5 years",
      linkedin: "https://linkedin.com/in/automated-test",
      portfolio: "https://github.com/automated-test",
      coverLetter: "This is an automated test application for Phase 2E verification.",
      resume: {
        fileName: "automated-test-resume.pdf",
        fileSize: 102400,
        mimeType: "application/pdf",
      },
      consent: true,
    };

    const res1 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    const data1 = await res1.json();

    assert(res1.status === 201, `Valid application returned 201 Created (got ${res1.status})`);
    assert(data1.success === true, "Response has success: true");
    assert(data1.application?.status === "new", "New application defaults to status: 'new'");
    assert(data1.application?.candidate === "Automated Tester", "Candidate full name correctly set");
    assert(data1.application?.jobSlug === "full-stack-developer", "Job slug correctly recorded");
    createdAppId = data1.application?._id || data1.application?.id;

    // TEST 2: Public POST - Invalid email
    console.log("\n--- 2. Public POST - Invalid Email Format ---");
    const invalidEmailPayload = { ...validPayload, email: "invalid-email-format" };
    const res2 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidEmailPayload),
    });
    assert(res2.status === 400, `Invalid email rejected with 400 (got ${res2.status})`);

    // TEST 3: Public POST - Missing required field (lastName)
    console.log("\n--- 3. Public POST - Missing Required Field ---");
    const missingFieldPayload = { ...validPayload, lastName: "" };
    const res3 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(missingFieldPayload),
    });
    assert(res3.status === 400, `Missing required field rejected with 400 (got ${res3.status})`);

    // TEST 4: Public POST - Consent false
    console.log("\n--- 4. Public POST - Consent False ---");
    const noConsentPayload = { ...validPayload, consent: false };
    const res4 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noConsentPayload),
    });
    assert(res4.status === 400, `Consent false rejected with 400 (got ${res4.status})`);

    // TEST 5: Public POST - Nonexistent job
    console.log("\n--- 5. Public POST - Nonexistent Job ---");
    const nonExistentJobPayload = { ...validPayload, jobSlug: "non-existent-role-xyz-999" };
    const res5 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nonExistentJobPayload),
    });
    assert(res5.status === 404, `Nonexistent job returns 404 (got ${res5.status})`);

    // TEST 6: Public POST - Draft job
    console.log("\n--- 6. Public POST - Draft Job Rejection ---");
    const draftJobPayload = { ...validPayload, jobSlug: "brand-designer" };
    const res6 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftJobPayload),
    });
    assert(res6.status === 400, `Draft job rejected with 400 (got ${res6.status})`);

    // TEST 7: Public POST - Closed job
    console.log("\n--- 7. Public POST - Closed Job Rejection ---");
    const closedJobPayload = { ...validPayload, jobSlug: "operations-coordinator" };
    const res7 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(closedJobPayload),
    });
    assert(res7.status === 400, `Closed job rejected with 400 (got ${res7.status})`);

    // TEST 8: Public POST - Duplicate application
    console.log("\n--- 8. Public POST - Duplicate Application Detection ---");
    const res8 = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    assert(res8.status === 409, `Duplicate application returned 409 Conflict (got ${res8.status})`);

    // TEST 9: Admin GET /api/admin/applications without session
    console.log("\n--- 9. Admin Protection - GET /api/admin/applications ---");
    const res9 = await fetch(`${BASE_URL}/api/admin/applications`);
    assert(res9.status === 401, `Unauthenticated GET /api/admin/applications returned 401 (got ${res9.status})`);

    // TEST 10: Admin GET /api/admin/applications/[id] without session
    console.log("\n--- 10. Admin Protection - GET /api/admin/applications/[id] ---");
    const res10 = await fetch(`${BASE_URL}/api/admin/applications/${createdAppId}`);
    assert(res10.status === 401, `Unauthenticated GET /api/admin/applications/[id] returned 401 (got ${res10.status})`);

    // TEST 11: Admin PATCH /api/admin/applications/[id] without session
    console.log("\n--- 11. Admin Protection - PATCH /api/admin/applications/[id] ---");
    const res11 = await fetch(`${BASE_URL}/api/admin/applications/${createdAppId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "viewed" }),
    });
    assert(res11.status === 401, `Unauthenticated PATCH /api/admin/applications/[id] returned 401 (got ${res11.status})`);

    // TEST 12: Database Model Integrity
    console.log("\n--- 12. Database Model Verification ---");
    const dbApp = await ApplicationModel.findById(createdAppId);
    assert(Boolean(dbApp), "Application saved in MongoDB database");
    assert(dbApp.status === "new", "Status is initially 'new'");
    assert(dbApp.viewedAt === undefined || dbApp.viewedAt === null, "viewedAt is initially unset");
    assert(dbApp.viewedBy === undefined || dbApp.viewedBy === null, "viewedBy is initially unset");

    const referencedJob = await JobModel.findById(dbApp.jobId);
    assert(Boolean(referencedJob), "jobId references an existing Job in MongoDB");
    assert(referencedJob.slug === dbApp.jobSlug, "jobSlug is consistent with Job");
    assert(referencedJob.title === dbApp.jobTitle, "jobTitle is consistent with Job");
    assert(referencedJob.team === dbApp.jobTeam, "jobTeam is consistent with Job");

    // Test transition to "viewed" directly in model
    const updatedDbApp = await ApplicationModel.findByIdAndUpdate(
      createdAppId,
      { $set: { status: "viewed", viewedAt: new Date() } },
      { new: true }
    );
    assert(updatedDbApp?.status === "viewed", "Status successfully transitioned to 'viewed'");
    assert(Boolean(updatedDbApp?.viewedAt), "viewedAt timestamp is recorded");

  } finally {
    // CLEANUP: Clean up test applications to ensure idempotency
    console.log("\n--- Cleanup ---");
    const deleteResult = await ApplicationModel.deleteMany({ email: TEST_EMAIL });
    console.log(`🧹 Cleaned up ${deleteResult.deletedCount} automated test application(s).`);
    await mongoose.disconnect();
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
