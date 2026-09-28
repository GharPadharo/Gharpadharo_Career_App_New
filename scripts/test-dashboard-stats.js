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
  console.log("PHASE 2G: ADMIN DASHBOARD STATS VERIFICATION SUITE");
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

  // Query active admin user directly from MongoDB User collection
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  }

  const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const dbAdmin = await UserModel.findOne({ role: { $in: ["admin", "superadmin"] }, isActive: true }).lean();
  
  if (!dbAdmin) {
    throw new Error("No active admin user found in MongoDB User collection for testing!");
  }
  const authorizedEmail = dbAdmin.email;

  // Generate valid admin session token for testing
  const cookieName = BASE_URL.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const adminToken = await encode({
    token: {
      name: dbAdmin.name || "Admin Tester",
      email: authorizedEmail,
      sub: dbAdmin._id.toString(),
      isAdmin: true,
      role: dbAdmin.role || "admin",
      dbUserId: dbAdmin._id.toString(),
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });

  const adminCookieHeader = `${cookieName}=${adminToken}; authjs.session-token=${adminToken}`;

  // TEST 1: Unauthenticated request returns 401
  console.log("--- 1. Security Check - Unauthenticated Request ---");
  try {
    const unauthRes = await fetch(`${BASE_URL}/api/admin/dashboard/stats`);
    assert(
      unauthRes.status === 401,
      `Unauthenticated request returns 401 Unauthorized (got ${unauthRes.status})`
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // TEST 2: Authenticated admin request can access the endpoint
  console.log("\n--- 2. Authenticated Admin Access ---");
  let statsData = null;
  let rawBody = null;
  try {
    const authRes = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        Cookie: adminCookieHeader,
      },
    });
    assert(
      authRes.status === 200,
      `Authenticated admin request returns 200 OK (got ${authRes.status})`
    );
    rawBody = await authRes.json();
    assert(rawBody.success === true, "Response has success: true");
    statsData = rawBody.data || rawBody;
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // TEST 3 & 4: Response contains required numeric fields
  console.log("\n--- 3 & 4. Statistics Fields and Types ---");
  if (statsData) {
    const jobs = statsData.jobs || {};
    const apps = statsData.applications || {};

    assert(typeof jobs.total === "number", `jobs.total is a number (found: ${jobs.total})`);
    assert(typeof jobs.active === "number", `jobs.active is a number (found: ${jobs.active})`);
    assert(typeof jobs.draft === "number", `jobs.draft is a number (found: ${jobs.draft})`);
    assert(typeof jobs.closed === "number", `jobs.closed is a number (found: ${jobs.closed})`);

    assert(
      typeof apps.total === "number",
      `applications.total is a number (found: ${apps.total})`
    );
    assert(
      typeof apps.new === "number",
      `applications.new is a number (found: ${apps.new})`
    );
    assert(
      typeof apps.viewed === "number",
      `applications.viewed is a number (found: ${apps.viewed})`
    );

    // TEST 5: Job counts internal consistency: active + draft + closed = total
    console.log("\n--- 5. Job Counts Internal Consistency ---");
    const jobSum = jobs.active + jobs.draft + jobs.closed;
    assert(
      jobSum === jobs.total,
      `Job counts consistent: ${jobs.active} active + ${jobs.draft} draft + ${jobs.closed} closed = ${jobs.total} total`
    );

    // TEST 6: Application counts internal consistency: new + viewed = total
    console.log("\n--- 6. Application Counts Internal Consistency ---");
    const appSum = apps.new + apps.viewed;
    assert(
      appSum === apps.total,
      `Application counts consistent: ${apps.new} new + ${apps.viewed} viewed = ${apps.total} total`
    );

    // TEST 7 & 12: Recent applications array and length <= 5
    console.log("\n--- 7 & 12. Recent Applications Structure & Limit ---");
    const recentApps = statsData.recentApplications;
    assert(Array.isArray(recentApps), "recentApplications is returned as an array");
    assert(
      recentApps.length <= 5,
      `Endpoint returns at most 5 recent applications (found: ${recentApps.length})`
    );

    // TEST 8: Recent applications contain NO sensitive fields
    console.log("\n--- 8. Recent Applications Data Privacy (No Sensitive Fields) ---");
    const sensitiveKeys = [
      "resume",
      "fileUrl",
      "publicId",
      "phone",
      "coverLetter",
      "linkedin",
      "portfolio",
    ];

    let leakFound = false;
    for (const app of recentApps) {
      for (const key of sensitiveKeys) {
        if (app[key] !== undefined) {
          leakFound = true;
          assert(false, `Sensitive key '${key}' leaked in recent application item: ${app.id}`);
        }
      }
    }
    if (!leakFound) {
      assert(
        true,
        "Recent applications contain strictly dashboard-safe summary fields (no phone, coverLetter, linkedin, portfolio, or resume URLs)"
      );
    }

    // Verify safe fields exist
    if (recentApps.length > 0) {
      const sample = recentApps[0];
      assert(Boolean(sample.id), "Recent application contains id");
      assert(Boolean(sample.candidate), "Recent application contains candidate name");
      assert(Boolean(sample.jobTitle), "Recent application contains jobTitle");
      assert(Boolean(sample.status), "Recent application contains status");
      assert(Boolean(sample.createdAt), "Recent application contains createdAt");
    }

    // TEST 9 & 13: Recent jobs array and length <= 5
    console.log("\n--- 9 & 13. Recent Jobs Structure & Limit ---");
    const recentJobs = statsData.recentJobs;
    assert(Array.isArray(recentJobs), "recentJobs is returned as an array");
    assert(
      recentJobs.length <= 5,
      `Endpoint returns at most 5 recent jobs (found: ${recentJobs.length})`
    );

    // TEST 10: Recent applications ordered newest-first
    console.log("\n--- 10. Recent Applications Chronological Ordering (Newest First) ---");
    let appsOrdered = true;
    for (let i = 0; i < recentApps.length - 1; i++) {
      const current = new Date(recentApps[i].createdAt).getTime();
      const next = new Date(recentApps[i + 1].createdAt).getTime();
      if (current < next) {
        appsOrdered = false;
        break;
      }
    }
    assert(
      appsOrdered,
      "Recent applications are ordered descending by createdAt (newest first)"
    );

    // TEST 11: Recent jobs ordered newest-first
    console.log("\n--- 11. Recent Jobs Chronological Ordering (Newest First) ---");
    let jobsOrdered = true;
    for (let i = 0; i < recentJobs.length - 1; i++) {
      const current = new Date(recentJobs[i].createdAt).getTime();
      const next = new Date(recentJobs[i + 1].createdAt).getTime();
      if (current < next) {
        jobsOrdered = false;
        break;
      }
    }
    assert(jobsOrdered, "Recent jobs are ordered descending by createdAt (newest first)");
  } else {
    assert(false, "No statsData available to verify fields");
  }

  await mongoose.disconnect();

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
