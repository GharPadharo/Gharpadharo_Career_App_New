/**
 * Admin Access Revocation CLI Script
 * 
 * Usage:
 *   npm run remove:admin -- admin@example.com
 *   node scripts/remove-admin.js admin@example.com
 */

import fs from "fs";
import path from "path";
import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";

function loadEnvConfig() {
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
}

loadEnvConfig();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function removeAdmin(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") {
    console.error("❌ ERROR: Email argument is required.");
    console.error("Usage: npm run remove:admin -- <email>");
    return { success: false, code: 1, error: "Missing email argument" };
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    console.error(`❌ ERROR: Invalid email address format: "${rawEmail}"`);
    console.error("Usage: npm run remove:admin -- <email>");
    return { success: false, code: 1, error: "Invalid email format" };
  }

  await connectDB();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.error(`❌ ERROR: User not found with email: ${normalizedEmail}`);
    return { success: false, code: 1, error: "User not found" };
  }

  // Superadmin Protection: Superadmins cannot be removed via standard remove-admin
  if (user.role === "superadmin") {
    console.error(`❌ ERROR: User "${user.email}" is a superadmin.`);
    console.error("Superadmin privileges cannot be revoked using remove:admin.");
    console.error("This requires a separate intentional administrative operation.");
    return { success: false, code: 1, error: "Cannot remove superadmin" };
  }

  // Final Admin Protection: Do not remove the last remaining active admin
  if (user.isActive) {
    const activeAdminsCount = await User.countDocuments({
      role: { $in: ["admin", "superadmin"] },
      isActive: true,
    });

    if (activeAdminsCount <= 1) {
      console.error(`❌ ERROR: Cannot revoke admin access for "${user.email}".`);
      console.error("This is the final active administrator in the system.");
      return { success: false, code: 1, error: "Cannot remove final active admin" };
    }
  }

  // Check if already inactive / revoked
  if (user.isActive === false) {
    console.log("Admin access is already revoked for this user.");
    console.log(`Email: ${user.email}`);
    console.log(`Active: false`);
    return { success: true, user, code: 0, alreadyRevoked: true };
  }

  // Safely revoke admin access without deleting the user document
  user.isActive = false;
  await user.save();

  console.log("Admin access revoked successfully.");
  console.log(`Email: ${user.email}`);
  console.log(`Active: false`);

  return { success: true, user, code: 0 };
}

// If executed directly from CLI
if (process.argv[1] && process.argv[1].endsWith("remove-admin.js")) {
  const emailArg = process.argv[2];
  removeAdmin(emailArg)
    .then((result) => {
      process.exit(result.code);
    })
    .catch((err) => {
      console.error("❌ ERROR:", err.message);
      process.exit(1);
    });
}
