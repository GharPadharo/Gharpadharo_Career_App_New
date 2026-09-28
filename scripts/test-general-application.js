import fs from "fs";
import path from "path";
import { encode } from "next-auth/jwt";
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
  console.log("GENERAL APPLICATION FEATURE VERIFICATION SUITE");
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

  // --------------------------------------------------
  // 1. STATIC CODE & ARCHITECTURE INSPECTION
  // --------------------------------------------------
  console.log("--- 1. Static Architecture & Component Inspection ---");

  const modelCode = fs.readFileSync(
    path.resolve(process.cwd(), "models/Application.js"),
    "utf-8"
  );
  assert(
    modelCode.includes('enum:\n        values: ["job", "general"]') ||
      modelCode.includes('["job", "general"]'),
    "Application schema supports enum values ['job', 'general']"
  );
  assert(
    modelCode.includes("default: null") &&
      (modelCode.includes('this.applicationType === "job"') ||
        modelCode.includes("this.applicationType === 'job'")),
    "Application schema conditionally requires jobId only for job applications"
  );
  assert(
    modelCode.includes("opportunityLookingFor") && modelCode.includes("aboutYourself"),
    "Application schema includes opportunityLookingFor and aboutYourself fields"
  );

  const ctaCode = fs.readFileSync(
    path.resolve(process.cwd(), "components/careers/GeneralApplicationCTA.js"),
    "utf-8"
  );
  assert(
    ctaCode.includes("Didn't find the right opportunity?") ||
      ctaCode.includes("Didn&apos;t find the right opportunity?"),
    "GeneralApplicationCTA has correct heading"
  );
  assert(
    ctaCode.includes('href="/jobs/general-application"'),
    "GeneralApplicationCTA links to /jobs/general-application"
  );

  const jobsContentCode = fs.readFileSync(
    path.resolve(process.cwd(), "components/careers/JobsContent.js"),
    "utf-8"
  );
  assert(
    jobsContentCode.includes("<GeneralApplicationCTA />"),
    "JobsContent renders GeneralApplicationCTA after job listings"
  );

  const pageCode = fs.readFileSync(
    path.resolve(process.cwd(), "app/jobs/general-application/page.js"),
    "utf-8"
  );
  assert(
    pageCode.includes("GENERAL APPLICATION"),
    "General Application page has GENERAL APPLICATION eyebrow"
  );

  const formCode = fs.readFileSync(
    path.resolve(process.cwd(), "components/careers/GeneralApplicationForm.js"),
    "utf-8"
  );
  assert(
    formCode.includes('applicationType: "general"'),
    "GeneralApplicationForm specifies applicationType: 'general'"
  );
  assert(
    formCode.includes("/api/uploads/resume"),
    "GeneralApplicationForm reuses secure /api/uploads/resume endpoint"
  );

  // --------------------------------------------------
  // 2. CONNECT TO DATABASE & GET ADMIN AUTH
  // --------------------------------------------------
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set!");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  const UserModel =
    mongoose.models.User ||
    mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const dbAdmin = await UserModel.findOne({
    role: { $in: ["admin", "superadmin"] },
    isActive: true,
  }).lean();

  if (!dbAdmin) {
    console.error("❌ No active admin found in database!");
    process.exit(1);
  }

  const cookieName = BASE_URL.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const adminToken = await encode({
    token: {
      name: dbAdmin.name || "Admin Tester",
      email: dbAdmin.email,
      sub: dbAdmin._id.toString(),
      isAdmin: true,
      role: dbAdmin.role || "admin",
      dbUserId: dbAdmin._id.toString(),
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });

  const adminCookie = `${cookieName}=${adminToken}; authjs.session-token=${adminToken}`;
  const appsCollection = mongoose.connection.collection("applications");

  const initialTotalApps = await appsCollection.countDocuments({});
  console.log(`\nInitial applications in database: ${initialTotalApps}`);

  // --------------------------------------------------
  // 3. PUBLIC API VALIDATION FOR GENERAL APPLICATIONS
  // --------------------------------------------------
  console.log("\n--- 2. Public Applications API: General Application Validation ---");

  // Missing required fields
  const missingNameRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "",
      lastName: "Tester",
      email: "general.test@example.com",
      consent: true,
      resume: "resume.pdf",
    }),
  });
  assert(
    missingNameRes.status === 400,
    "General application with missing first name is rejected with 400"
  );

  const missingEmailRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "Valid",
      lastName: "Tester",
      email: "invalid-email-address",
      consent: true,
      resume: "resume.pdf",
    }),
  });
  assert(
    missingEmailRes.status === 400,
    "General application with invalid email is rejected with 400"
  );

  const missingConsentRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "Valid",
      lastName: "Tester",
      email: "general.test@example.com",
      consent: false,
      resume: "resume.pdf",
    }),
  });
  assert(
    missingConsentRes.status === 400,
    "General application with consent: false is rejected with 400"
  );

  const missingResumeRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "Valid",
      lastName: "Tester",
      email: "general.test@example.com",
      consent: true,
      resume: null,
    }),
  });
  assert(
    missingResumeRes.status === 400,
    "General application without resume is rejected with 400"
  );

  // --------------------------------------------------
  // 4. SUBMIT VALID GENERAL APPLICATION (WITHOUT JOB ID)
  // --------------------------------------------------
  console.log("\n--- 3. Submit Valid General Application ---");

  const testEmail = `general.talent.${Date.now()}@example.com`;
  const validSubmissionRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "Aarav",
      lastName: "Patel",
      email: testEmail,
      phone: "+91 98765 43210",
      currentJobTitle: "Lead Systems Architect",
      experience: "5–8 years",
      linkedin: "https://linkedin.com/in/aaravpatel",
      portfolio: "https://aaravpatel.dev",
      opportunityLookingFor: "Looking for Principal Engineer or VP of Engineering roles",
      aboutYourself: "Passionate about high-throughput distributed systems and scaling products",
      resume: {
        fileName: "Aarav_Patel_Resume.pdf",
        fileSize: 102400,
        mimeType: "application/pdf",
        fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
        publicId: "gharpadharo-careers/resumes/resume_test_general_001",
      },
      consent: true,
    }),
  });

  const validSubmissionData = await validSubmissionRes.json();
  assert(
    validSubmissionRes.status === 201,
    `Valid general application returns 201 Created (got ${validSubmissionRes.status})`
  );
  assert(
    validSubmissionData.success === true,
    "Response has success: true"
  );
  assert(
    validSubmissionData.application?.applicationType === "general",
    "Application serializer returns applicationType: 'general'"
  );
  assert(
    validSubmissionData.application?.jobTitle === "General Application",
    "Application serializer returns jobTitle: 'General Application'"
  );

  const createdId = validSubmissionData.application?._id;

  // --------------------------------------------------
  // 5. DUPLICATE GENERAL APPLICATION DETECTION
  // --------------------------------------------------
  console.log("\n--- 4. Duplicate General Application Prevention ---");

  const duplicateRes = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationType: "general",
      firstName: "Aarav",
      lastName: "Patel",
      email: testEmail, // Same normalized email
      consent: true,
      resume: "Aarav_Patel_Resume.pdf",
    }),
  });
  assert(
    duplicateRes.status === 409,
    `Duplicate general application rejected with 409 Conflict (got ${duplicateRes.status})`
  );

  // --------------------------------------------------
  // 6. VERIFY IN MONGODB & STATS/COUNTS
  // --------------------------------------------------
  console.log("\n--- 5. Database & Admin Stats Verification ---");

  const dbDoc = await appsCollection.findOne({ _id: new mongoose.Types.ObjectId(createdId) });
  assert(
    dbDoc !== null,
    "General application document persisted in MongoDB"
  );
  assert(
    dbDoc.applicationType === "general",
    "MongoDB document has applicationType === 'general'"
  );
  assert(
    dbDoc.jobId === null,
    "MongoDB document has jobId === null (no fake Job created)"
  );
  assert(
    dbDoc.jobSlug === null,
    "MongoDB document has jobSlug === null"
  );
  assert(
    dbDoc.opportunityLookingFor === "Looking for Principal Engineer or VP of Engineering roles",
    "opportunityLookingFor correctly saved"
  );

  const newTotalApps = await appsCollection.countDocuments({});
  assert(
    newTotalApps === initialTotalApps + 1,
    `Total applications count increased from ${initialTotalApps} to ${newTotalApps}`
  );

  // Query Dashboard Stats API
  const statsRes = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
    headers: { Cookie: adminCookie },
  });
  const statsData = await statsRes.json();
  const apiTotal = statsData?.data?.applications?.total ?? statsData?.applications?.total;
  assert(
    apiTotal === newTotalApps,
    `Admin stats applications.total (${apiTotal}) includes general applications`
  );

  // --------------------------------------------------
  // 7. ADMIN APPLICATIONS LIST & FILTERING
  // --------------------------------------------------
  console.log("\n--- 6. Admin Applications List & Type Filter ---");

  // Fetch admin applications
  const adminAppsRes = await fetch(`${BASE_URL}/api/admin/applications`, {
    headers: { Cookie: adminCookie },
  });
  const adminAppsData = await adminAppsRes.json();
  const foundInAll = adminAppsData.applications?.some((a) => a.id === createdId || a._id === createdId);
  assert(
    foundInAll === true,
    "General application appears in /api/admin/applications list"
  );

  // Fetch with type=general
  const generalFilterRes = await fetch(`${BASE_URL}/api/admin/applications?type=general`, {
    headers: { Cookie: adminCookie },
  });
  const generalFilterData = await generalFilterRes.json();
  const foundInGeneral = generalFilterData.applications?.some(
    (a) => a.id === createdId || a._id === createdId
  );
  assert(
    foundInGeneral === true,
    "General application is returned when filtered by type=general"
  );

  // Update status to 'viewed'
  const patchRes = await fetch(`${BASE_URL}/api/admin/applications/${createdId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ status: "viewed" }),
  });
  assert(
    patchRes.status === 200,
    "General application status can be updated to 'viewed' via PATCH"
  );

  // --------------------------------------------------
  // 8. PUBLIC PAGES INTEGRITY
  // --------------------------------------------------
  console.log("\n--- 7. Public UI & Route Accessibility ---");

  const generalPageRes = await fetch(`${BASE_URL}/jobs/general-application`);
  const generalPageHtml = await generalPageRes.text();
  assert(
    generalPageRes.status === 200,
    "GET /jobs/general-application returns HTTP 200"
  );
  assert(
    generalPageHtml.includes("GENERAL APPLICATION") &&
      (generalPageHtml.includes("Didn't find the right opportunity?") ||
        generalPageHtml.includes("Didn&apos;t find the right opportunity?")),
    "General application page renders eyebrow and heading"
  );

  const jobsPageRes = await fetch(`${BASE_URL}/jobs`);
  const jobsPageHtml = await jobsPageRes.text();
  assert(
    jobsPageRes.status === 200,
    "GET /jobs returns HTTP 200"
  );
  assert(
    jobsPageHtml.includes("/jobs/general-application"),
    "/jobs contains CTA link to /jobs/general-application"
  );

  // --------------------------------------------------
  // 9. CLEANUP / BULK DELETE
  // --------------------------------------------------
  console.log("\n--- 8. Cleanup & Bulk Deletion of General Application ---");

  const deleteRes = await fetch(`${BASE_URL}/api/admin/applications/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ ids: [createdId] }),
  });
  const deleteData = await deleteRes.json();
  assert(
    deleteRes.status === 200 && deleteData.deletedCount === 1,
    "General application successfully deleted via bulk delete endpoint"
  );

  const finalTotalApps = await appsCollection.countDocuments({});
  assert(
    finalTotalApps === initialTotalApps,
    `Application count returned cleanly to ${finalTotalApps}`
  );

  await mongoose.disconnect();

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
