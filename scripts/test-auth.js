/**
 * Phase 2B / MongoDB Authorization Architecture Verification Suite
 * Usage: node scripts/test-auth.js
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// 1. Load .env.local
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

// Explicitly delete ADMIN_EMAILS from environment to prove zero runtime dependency
delete process.env.ADMIN_EMAILS;

import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import { getAdminUserByEmail, isAuthorizedAdmin } from "../lib/authAdmin.js";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("MONGODB-BACKED ADMIN AUTHORIZATION VERIFICATION SUITE");
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

  const TEST_PREFIX = `authtest-${Date.now()}`;
  const ACTIVE_ADMIN_EMAIL = `${TEST_PREFIX}-admin@example.com`;
  const ACTIVE_SUPERADMIN_EMAIL = `${TEST_PREFIX}-superadmin@example.com`;
  const INACTIVE_ADMIN_EMAIL = `${TEST_PREFIX}-inactive@example.com`;
  const REGULAR_USER_EMAIL = `${TEST_PREFIX}-user@example.com`;
  const NONEXISTENT_EMAIL = `${TEST_PREFIX}-nonexistent@example.com`;

  try {
    console.log("1. Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("   ✓ Connected successfully.\n");

    // Clean up any matching test fixture users
    await User.deleteMany({ email: new RegExp(TEST_PREFIX) });

    // Seed test users
    console.log("2. Setting up test user fixtures in MongoDB...");
    const adminUser = await User.create({
      email: ACTIVE_ADMIN_EMAIL,
      name: "Test Admin",
      role: "admin",
      isActive: true,
    });
    await User.create({
      email: ACTIVE_SUPERADMIN_EMAIL,
      name: "Test SuperAdmin",
      role: "superadmin",
      isActive: true,
    });
    await User.create({
      email: INACTIVE_ADMIN_EMAIL,
      name: "Test Inactive Admin",
      role: "admin",
      isActive: false,
    });
    // Insert non-admin role via collection.insertOne to bypass Mongoose enum validation
    await User.collection.insertOne({
      email: REGULAR_USER_EMAIL,
      name: "Test Regular User",
      role: "viewer",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("   ✓ Fixtures created.\n");

    // TEST 1: Active Admin User
    console.log("--- 1. Active Admin User Authorization ---");
    const adminRes = await getAdminUserByEmail(ACTIVE_ADMIN_EMAIL);
    assert(adminRes !== null && adminRes.role === "admin", "Active admin user (role === 'admin') is authorized");
    assert((await isAuthorizedAdmin(ACTIVE_ADMIN_EMAIL)) === true, "isAuthorizedAdmin returns true for active admin");

    // TEST 2: Active Superadmin User
    console.log("\n--- 2. Active SuperAdmin User Authorization ---");
    const superadminRes = await getAdminUserByEmail(ACTIVE_SUPERADMIN_EMAIL);
    assert(superadminRes !== null && superadminRes.role === "superadmin", "Active superadmin user (role === 'superadmin') is authorized");
    assert((await isAuthorizedAdmin(ACTIVE_SUPERADMIN_EMAIL)) === true, "isAuthorizedAdmin returns true for active superadmin");

    // TEST 3: Authenticated Google email not present in DB -> denied
    console.log("\n--- 3. Unknown Google Email Denied ---");
    const unknownRes = await getAdminUserByEmail(NONEXISTENT_EMAIL);
    assert(unknownRes === null, "Unknown Google email not in MongoDB is denied (returns null)");
    assert((await isAuthorizedAdmin(NONEXISTENT_EMAIL)) === false, "isAuthorizedAdmin returns false for unknown email");

    // TEST 4: Inactive Admin User (isActive: false) -> denied
    console.log("\n--- 4. Inactive Admin User Denied ---");
    const inactiveRes = await getAdminUserByEmail(INACTIVE_ADMIN_EMAIL);
    assert(inactiveRes === null, "User with isActive === false is denied (returns null)");
    assert((await isAuthorizedAdmin(INACTIVE_ADMIN_EMAIL)) === false, "isAuthorizedAdmin returns false for inactive user");

    // TEST 5: Unauthorized Role (role === 'user') -> denied
    console.log("\n--- 5. Non-Admin Role Denied ---");
    const userRoleRes = await getAdminUserByEmail(REGULAR_USER_EMAIL);
    assert(userRoleRes === null, "User with role !== 'admin'/'superadmin' is denied (returns null)");
    assert((await isAuthorizedAdmin(REGULAR_USER_EMAIL)) === false, "isAuthorizedAdmin returns false for role: 'user'");

    // TEST 6: Email Normalization
    console.log("\n--- 6. Email Normalization ---");
    const upperCasePadded = `   ${ACTIVE_ADMIN_EMAIL.toUpperCase()}   `;
    const normalizedRes = await getAdminUserByEmail(upperCasePadded);
    assert(normalizedRes !== null && normalizedRes.email === ACTIVE_ADMIN_EMAIL, "Email normalization handles uppercase and whitespace trimming");
    assert((await isAuthorizedAdmin(upperCasePadded)) === true, "isAuthorizedAdmin succeeds with padded uppercase email");

    // TEST 7: Invalid / Empty Inputs
    console.log("\n--- 7. Invalid Inputs Guard ---");
    assert((await getAdminUserByEmail("")) === null, "Empty email returns null");
    assert((await getAdminUserByEmail(null)) === null, "null email returns null");
    assert((await getAdminUserByEmail(undefined)) === null, "undefined email returns null");

    // TEST 8: Revocation upon user deletion
    console.log("\n--- 8. User Revocation Verification ---");
    await User.findByIdAndDelete(adminUser._id);
    const revokedRes = await getAdminUserByEmail(ACTIVE_ADMIN_EMAIL);
    assert(revokedRes === null, "Deleted admin user is immediately denied authorization");

    // TEST 9: ADMIN_EMAILS environment variable absence
    console.log("\n--- 9. Absence of ADMIN_EMAILS Runtime Dependency ---");
    assert(process.env.ADMIN_EMAILS === undefined, "process.env.ADMIN_EMAILS is completely unset");
    const stillAuthorizedSuperadmin = await isAuthorizedAdmin(ACTIVE_SUPERADMIN_EMAIL);
    assert(stillAuthorizedSuperadmin === true, "Authorization functions correctly without ADMIN_EMAILS env variable");

    // TEST 10: HTTP Route Protection Tests (via local dev server)
    console.log("\n--- 10. Route Protection & Redirects (Logged Out) ---");
    try {
      const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: "manual" });
      const dashLoc = dashRes.headers.get("location") || "";
      assert(
        dashRes.status === 307 || dashRes.status === 308 || dashRes.status === 302 || dashLoc.includes("/admin/login"),
        `/admin/dashboard redirects unauthenticated visitor to login (Status: ${dashRes.status})`
      );

      const jobsAdminRes = await fetch(`${BASE_URL}/admin/dashboard/jobs`, { redirect: "manual" });
      assert(
        jobsAdminRes.status === 307 || jobsAdminRes.status === 308 || jobsAdminRes.status === 302,
        `/admin/dashboard/jobs redirects unauthenticated visitor to login (Status: ${jobsAdminRes.status})`
      );

      const appsAdminRes = await fetch(`${BASE_URL}/admin/dashboard/applications`, { redirect: "manual" });
      assert(
        appsAdminRes.status === 307 || appsAdminRes.status === 308 || appsAdminRes.status === 302,
        `/admin/dashboard/applications redirects unauthenticated visitor to login (Status: ${appsAdminRes.status})`
      );

      // Public routes accessible
      const pubJobsRes = await fetch(`${BASE_URL}/jobs`);
      assert(pubJobsRes.status === 200, "Public /jobs is accessible without authentication (HTTP 200)");

      // Login page
      const loginPageRes = await fetch(`${BASE_URL}/admin/login`);
      assert(loginPageRes.status === 200, "Admin login page is accessible (HTTP 200)");

      // AccessDenied error handling
      const accessDeniedRes = await fetch(`${BASE_URL}/admin/login?error=AccessDenied`);
      const accessDeniedHtml = await accessDeniedRes.text();
      assert(
        accessDeniedHtml.includes("Access denied") || accessDeniedHtml.includes("not authorized"),
        "Login page renders Access Denied alert message when error=AccessDenied"
      );

      // API route protection
      const statsApiRes = await fetch(`${BASE_URL}/api/admin/dashboard/stats`);
      assert(statsApiRes.status === 401, "Admin stats API rejects unauthenticated caller with 401");

      const jobsApiRes = await fetch(`${BASE_URL}/api/admin/jobs`);
      assert(jobsApiRes.status === 401, "Admin jobs API rejects unauthenticated caller with 401");

      const appsApiRes = await fetch(`${BASE_URL}/api/admin/applications`);
      assert(appsApiRes.status === 401, "Admin applications API rejects unauthenticated caller with 401");

      // NextAuth API endpoints
      const providersRes = await fetch(`${BASE_URL}/api/auth/providers`);
      const providersJson = await providersRes.json();
      assert(providersRes.status === 200 && providersJson.google, "Auth API provides Google provider registration");

    } catch (httpErr) {
      console.warn("⚠️ HTTP check skipped/failed (ensure dev server is running on port 3000):", httpErr.message);
    }

  } finally {
    console.log("\n--- Cleanup ---");
    const cleanupResult = await User.deleteMany({ email: new RegExp(TEST_PREFIX) });
    console.log(`🧹 Cleaned up ${cleanupResult.deletedCount} temporary test user fixtures.`);
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

runTests();
