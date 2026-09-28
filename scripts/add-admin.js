/**
 * Admin Provisioning CLI Script
 * 
 * Usage:
 *   npm run add:admin -- admin@example.com
 *   node scripts/add-admin.js admin@example.com
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

export async function addAdmin(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") {
    console.error("❌ ERROR: Email argument is required.");
    console.error("Usage: npm run add:admin -- <email>");
    return { success: false, code: 1, error: "Missing email argument" };
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    console.error(`❌ ERROR: Invalid email address format: "${rawEmail}"`);
    console.error("Usage: npm run add:admin -- <email>");
    return { success: false, code: 1, error: "Invalid email format" };
  }

  await connectDB();

  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    // Preserve superadmin role if already assigned, otherwise ensure admin
    if (user.role !== "superadmin") {
      user.role = "admin";
    }
    user.isActive = true;

    if (!user.name) {
      const localPart = normalizedEmail.split("@")[0].replace(/[._-]/g, " ");
      user.name = localPart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    await user.save();

    console.log("Admin provisioned successfully.");
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Active: ${user.isActive}`);

    return { success: true, user, code: 0 };
  } else {
    const localPart = normalizedEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = localPart
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    user = await User.create({
      email: normalizedEmail,
      name: formattedName || "Admin User",
      role: "admin",
      isActive: true,
    });

    console.log("Admin provisioned successfully.");
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Active: ${user.isActive}`);

    return { success: true, user, code: 0 };
  }
}

// If executed directly from CLI
if (process.argv[1] && process.argv[1].endsWith("add-admin.js")) {
  const emailArg = process.argv[2];
  addAdmin(emailArg)
    .then((result) => {
      process.exit(result.code);
    })
    .catch((err) => {
      console.error("❌ ERROR:", err.message);
      process.exit(1);
    });
}
