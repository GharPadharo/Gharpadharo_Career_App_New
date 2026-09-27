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

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 2D: JOBS API VERIFICATION SUITE");
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

  // TEST 1: Public GET /api/jobs
  console.log("--- 1. Public GET /api/jobs ---");
  try {
    const res = await fetch(`${BASE_URL}/api/jobs`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/jobs returned 200 OK");
    assert(data.success === true, "Response has success: true");
    assert(data.count === 6, `Expected 6 active jobs, received ${data.count}`);
    const allActive = data.jobs.every((j) => j.status === "active");
    assert(allActive, "All returned jobs have status === 'active'");
    const hasPostedText = data.jobs.every((j) => typeof j.postedText === "string");
    assert(hasPostedText, "All returned jobs have valid postedText");
    const hasSlugId = data.jobs.every((j) => j.id === j.slug);
    assert(hasSlugId, "All returned jobs have id mapped to slug");
  } catch (err) {
    assert(false, `GET /api/jobs threw error: ${err.message}`);
  }

  // TEST 2: Public GET /api/jobs/[id] - Active Job
  console.log("\n--- 2. Public GET /api/jobs/[id] - Active Job ---");
  try {
    const res = await fetch(`${BASE_URL}/api/jobs/full-stack-developer`);
    const data = await res.json();
    assert(res.status === 200, "Active job returns 200 OK");
    assert(data.success === true, "Response has success: true");
    assert(data.job.title === "Full Stack Developer", "Title matches 'Full Stack Developer'");
    assert(data.job.status === "active", "Status is 'active'");
  } catch (err) {
    assert(false, `Active job check threw error: ${err.message}`);
  }

  // TEST 3: Public GET /api/jobs/[id] - Draft Job (Must return 404 for public)
  console.log("\n--- 3. Public GET /api/jobs/[id] - Draft Job Protection ---");
  try {
    const res = await fetch(`${BASE_URL}/api/jobs/brand-designer`);
    assert(res.status === 404, "Draft job returns 404 Not Found to public");
  } catch (err) {
    assert(false, `Draft job check threw error: ${err.message}`);
  }

  // TEST 4: Public GET /api/jobs/[id] - Closed Job (Must return 200 with closed status)
  console.log("\n--- 4. Public GET /api/jobs/[id] - Closed Job ---");
  try {
    const res = await fetch(`${BASE_URL}/api/jobs/operations-coordinator`);
    const data = await res.json();
    assert(res.status === 200, "Closed job returns 200 OK");
    assert(data.job.status === "closed", "Status is 'closed'");
  } catch (err) {
    assert(false, `Closed job check threw error: ${err.message}`);
  }

  // TEST 5: Public GET /api/jobs/[id] - Non-existent Job
  console.log("\n--- 5. Public GET /api/jobs/[id] - Non-existent Job ---");
  try {
    const res = await fetch(`${BASE_URL}/api/jobs/non-existent-role-xyz`);
    assert(res.status === 404, "Non-existent job returns 404 Not Found");
  } catch (err) {
    assert(false, `Non-existent job check threw error: ${err.message}`);
  }

  // TEST 6: Admin GET /api/admin/jobs without session
  console.log("\n--- 6. Admin API Protection - GET /api/admin/jobs ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/jobs`);
    assert(res.status === 401, "Unauthenticated GET /api/admin/jobs returns 401");
  } catch (err) {
    assert(false, `Admin GET protection threw error: ${err.message}`);
  }

  // TEST 7: Admin POST /api/admin/jobs without session
  console.log("\n--- 7. Admin API Protection - POST /api/admin/jobs ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauthorized Test Job" }),
    });
    assert(res.status === 401, "Unauthenticated POST /api/admin/jobs returns 401");
  } catch (err) {
    assert(false, `Admin POST protection threw error: ${err.message}`);
  }

  // TEST 8: Admin PATCH /api/admin/jobs/[id] without session
  console.log("\n--- 8. Admin API Protection - PATCH /api/admin/jobs/[id] ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/jobs/full-stack-developer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hacked Job Title" }),
    });
    assert(res.status === 401, "Unauthenticated PATCH returns 401");
  } catch (err) {
    assert(false, `Admin PATCH protection threw error: ${err.message}`);
  }

  // TEST 9: Admin DELETE /api/admin/jobs/[id] without session
  console.log("\n--- 9. Admin API Protection - DELETE /api/admin/jobs/[id] ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/jobs/full-stack-developer`, {
      method: "DELETE",
    });
    assert(res.status === 401, "Unauthenticated DELETE returns 401");
  } catch (err) {
    assert(false, `Admin DELETE protection threw error: ${err.message}`);
  }

  // Direct MongoDB verification of database contents
  console.log("\n--- 10. Database Model Integrity ---");
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    const JobModel = mongoose.models.Job || mongoose.model("Job", new mongoose.Schema({}, { strict: false }));
    const totalJobs = await JobModel.countDocuments();
    assert(totalJobs === 8, `Total jobs in database is 8 (found: ${totalJobs})`);
    const activeCount = await JobModel.countDocuments({ status: "active" });
    assert(activeCount === 6, `Active jobs in database is 6 (found: ${activeCount})`);
    const draftCount = await JobModel.countDocuments({ status: "draft" });
    assert(draftCount === 1, `Draft jobs in database is 1 (found: ${draftCount})`);
    const closedCount = await JobModel.countDocuments({ status: "closed" });
    assert(closedCount === 1, `Closed jobs in database is 1 (found: ${closedCount})`);
    await mongoose.disconnect();
  } catch (err) {
    assert(false, `Database check threw error: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
