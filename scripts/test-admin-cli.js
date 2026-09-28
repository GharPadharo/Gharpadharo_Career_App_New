/**
 * Admin CLI Provisioning & Revocation Verification Suite
 * Usage: node scripts/test-admin-cli.js
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import mongoose from "mongoose";

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

// Ensure zero reliance on ADMIN_EMAILS or ADMIN_SEED_EMAIL
delete process.env.ADMIN_EMAILS;
delete process.env.ADMIN_SEED_EMAIL;

import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import { isAuthorizedAdmin, getAdminUserByEmail } from "../lib/authAdmin.js";
import { addAdmin } from "./add-admin.js";
import { removeAdmin } from "./remove-admin.js";

async function runCliTests() {
  console.log("==================================================");
  console.log("ADMIN CLI PROVISIONING & REVOCATION TEST SUITE");
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

  const TEST_PREFIX = `cli-test-${Date.now()}`;
  const TEST_ADMIN_1 = `${TEST_PREFIX}-admin1@example.com`;
  const TEST_ADMIN_2 = `${TEST_PREFIX}-admin2@example.com`;
  const TEST_SUPERADMIN = `${TEST_PREFIX}-superadmin@example.com`;

  try {
    await connectDB();
    console.log("1. Connected to MongoDB Atlas.\n");

    // Clean up any pre-existing test fixtures matching prefix
    await User.deleteMany({ email: new RegExp(TEST_PREFIX) });

    // ----------------------------------------------------
    // SECTION A: ADD ADMIN TESTS
    // ----------------------------------------------------
    console.log("--- SECTION A: ADD ADMIN TESTS ---");

    // TEST 1: Missing email fails
    console.log("\n1. Missing email argument");
    const missingAddRes = await addAdmin("");
    assert(missingAddRes.success === false && missingAddRes.code === 1, "Missing email returns failure code 1");

    // CLI invocation test for missing email
    try {
      execSync("node scripts/add-admin.js", { stdio: "pipe" });
      assert(false, "CLI without email should exit with non-zero");
    } catch (cliErr) {
      assert(cliErr.status !== 0, "CLI without email correctly exited with non-zero code");
    }

    // TEST 2: Invalid email fails
    console.log("\n2. Invalid email format");
    const invalidAddRes = await addAdmin("not-a-valid-email");
    assert(invalidAddRes.success === false && invalidAddRes.code === 1, "Invalid email format rejected");

    try {
      execSync("node scripts/add-admin.js not-an-email", { stdio: "pipe" });
      assert(false, "CLI with invalid email should exit with non-zero");
    } catch (cliErr) {
      assert(cliErr.status !== 0, "CLI with invalid email correctly exited with non-zero code");
    }

    // TEST 3: New email creates an admin
    console.log("\n3. Provisioning new admin user");
    const newAdminRes = await addAdmin(TEST_ADMIN_1);
    assert(newAdminRes.success === true && newAdminRes.code === 0, "addAdmin succeeds with code 0");
    const dbAdmin1 = await User.findOne({ email: TEST_ADMIN_1 });
    assert(Boolean(dbAdmin1), "User document created in MongoDB");
    assert(dbAdmin1.role === "admin", "User role is 'admin'");
    assert(dbAdmin1.isActive === true, "User isActive is true");

    // TEST 4: Existing inactive user becomes active admin
    console.log("\n4. Existing inactive user activated as admin");
    await User.updateOne({ email: TEST_ADMIN_1 }, { $set: { isActive: false } });
    const reactivateRes = await addAdmin(TEST_ADMIN_1);
    assert(reactivateRes.success === true, "Existing inactive user successfully updated");
    const reactivatedUser = await User.findOne({ email: TEST_ADMIN_1 });
    assert(reactivatedUser.isActive === true, "User is now active again");
    assert(reactivatedUser.role === "admin", "User role remains 'admin'");

    // TEST 5: Existing admin is not duplicated and preserves fields
    console.log("\n5. Idempotent addition (no duplication, profile preserved)");
    const initialCount = await User.countDocuments({ email: TEST_ADMIN_1 });
    assert(initialCount === 1, "Exactly 1 user document exists prior to re-run");
    const idempotentRes = await addAdmin(TEST_ADMIN_1);
    assert(idempotentRes.success === true, "Re-running addAdmin succeeds");
    const postCount = await User.countDocuments({ email: TEST_ADMIN_1 });
    assert(postCount === 1, "User count remains 1 (no duplicate documents)");

    // TEST 6: Email normalization (whitespace & uppercase)
    console.log("\n6. Email normalization");
    const messyEmail = `   ${TEST_ADMIN_2.toUpperCase()}   `;
    const normRes = await addAdmin(messyEmail);
    assert(normRes.success === true, "Messy email handled successfully");
    const normalizedDbUser = await User.findOne({ email: TEST_ADMIN_2 });
    assert(Boolean(normalizedDbUser), "User found by lowercase normalized email in MongoDB");
    assert(normalizedDbUser.email === TEST_ADMIN_2, "Stored email is trimmed and lowercase");

    // ----------------------------------------------------
    // SECTION B: AUTHORIZATION VERIFICATION
    // ----------------------------------------------------
    console.log("\n--- SECTION B: AUTHORIZATION VERIFICATION ---");

    // TEST 7: Added admin can pass existing authorization checks
    const auth1 = await isAuthorizedAdmin(TEST_ADMIN_1);
    assert(auth1 === true, "Added admin passes isAuthorizedAdmin");
    const authLookup1 = await getAdminUserByEmail(TEST_ADMIN_1);
    assert(authLookup1 !== null && authLookup1.email === TEST_ADMIN_1, "Added admin found by getAdminUserByEmail");

    // ----------------------------------------------------
    // SECTION C: REMOVE ADMIN TESTS
    // ----------------------------------------------------
    console.log("\n--- SECTION C: REMOVE ADMIN TESTS ---");

    // TEST 8: Missing email fails
    console.log("\n8. Missing email in removeAdmin");
    const missingRemoveRes = await removeAdmin("");
    assert(missingRemoveRes.success === false && missingRemoveRes.code === 1, "Missing email in removeAdmin fails");

    try {
      execSync("node scripts/remove-admin.js", { stdio: "pipe" });
      assert(false, "CLI remove without email should exit with non-zero");
    } catch (cliErr) {
      assert(cliErr.status !== 0, "CLI remove without email correctly exited with non-zero code");
    }

    // TEST 9: Unknown email fails with non-zero status
    console.log("\n9. Unknown email in removeAdmin");
    const unknownEmail = `${TEST_PREFIX}-doesnotexist@example.com`;
    const unknownRemoveRes = await removeAdmin(unknownEmail);
    assert(unknownRemoveRes.success === false && unknownRemoveRes.code === 1, "Unknown user removal fails with code 1");

    try {
      execSync(`node scripts/remove-admin.js ${unknownEmail}`, { stdio: "pipe" });
      assert(false, "CLI remove for unknown email should exit with non-zero");
    } catch (cliErr) {
      assert(cliErr.status !== 0, "CLI remove for unknown email exited with non-zero code");
    }

    // TEST 10: Existing admin loses admin access (isActive: false)
    console.log("\n10. Revoking admin access");
    const removeRes = await removeAdmin(TEST_ADMIN_2);
    assert(removeRes.success === true && removeRes.code === 0, "removeAdmin succeeds with code 0");
    const revokedUser = await User.findOne({ email: TEST_ADMIN_2 });
    assert(Boolean(revokedUser), "User document still exists in MongoDB (not deleted)");
    assert(revokedUser.isActive === false, "User isActive is now false");

    // TEST 11: Removed/inactive user fails authorization checks
    console.log("\n11. Authorization denied for revoked admin");
    const authRevoked = await isAuthorizedAdmin(TEST_ADMIN_2);
    assert(authRevoked === false, "Revoked user fails isAuthorizedAdmin");
    const lookupRevoked = await getAdminUserByEmail(TEST_ADMIN_2);
    assert(lookupRevoked === null, "Revoked user returns null from getAdminUserByEmail");

    // TEST 12: Re-running removal is safe/idempotent
    console.log("\n12. Idempotent removal");
    const rerunRemoveRes = await removeAdmin(TEST_ADMIN_2);
    assert(rerunRemoveRes.success === true && rerunRemoveRes.alreadyRevoked === true, "Re-running removal on inactive user reports already revoked");

    // TEST 13: Superadmin protection
    console.log("\n13. Superadmin protection");
    // Create a superadmin fixture
    await User.create({
      email: TEST_SUPERADMIN,
      name: "Test SuperAdmin",
      role: "superadmin",
      isActive: true,
    });
    const superadminRemoveRes = await removeAdmin(TEST_SUPERADMIN);
    assert(superadminRemoveRes.success === false && superadminRemoveRes.code === 1, "Superadmin removal blocked with code 1");
    const intactSuperadmin = await User.findOne({ email: TEST_SUPERADMIN });
    assert(intactSuperadmin.role === "superadmin" && intactSuperadmin.isActive === true, "Superadmin remains active superadmin");

    // TEST 14: Final active admin protection
    console.log("\n14. Final remaining active admin protection");
    // Temporarily mark all other admins inactive so TEST_ADMIN_1 is the sole active admin
    const otherAdmins = await User.find({
      email: { $ne: TEST_ADMIN_1 },
      role: { $in: ["admin", "superadmin"] },
      isActive: true,
    });
    const otherAdminIds = otherAdmins.map((u) => u._id);
    await User.updateMany({ _id: { $in: otherAdminIds } }, { $set: { isActive: false } });

    // Attempting to remove the sole active admin must fail
    const finalAdminRemoveRes = await removeAdmin(TEST_ADMIN_1);
    assert(finalAdminRemoveRes.success === false && finalAdminRemoveRes.code === 1, "Refuses to remove final active administrator");

    // Restore the other admins
    await User.updateMany({ _id: { $in: otherAdminIds } }, { $set: { isActive: true } });

    // TEST 15: npm run scripts verification via npm
    console.log("\n15. npm run add:admin & remove:admin integration");
    const npmTestEmail = `${TEST_PREFIX}-npm@example.com`;
    execSync(`npm run add:admin -- ${npmTestEmail}`, { stdio: "pipe" });
    const npmCreated = await User.findOne({ email: npmTestEmail });
    assert(Boolean(npmCreated) && npmCreated.isActive === true, "npm run add:admin successfully created active admin");

    execSync(`npm run remove:admin -- ${npmTestEmail}`, { stdio: "pipe" });
    const npmRemoved = await User.findOne({ email: npmTestEmail });
    assert(Boolean(npmRemoved) && npmRemoved.isActive === false, "npm run remove:admin successfully revoked admin access");

  } finally {
    console.log("\n--- Cleanup ---");
    const cleaned = await User.deleteMany({ email: new RegExp(TEST_PREFIX) });
    console.log(`🧹 Cleaned up ${cleaned.deletedCount} temporary test user fixtures.`);
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

runCliTests();
