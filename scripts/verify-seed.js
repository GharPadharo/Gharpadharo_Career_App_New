/**
 * Independent Seed Verification Script
 * 
 * Inspects MongoDB Atlas collections and validates schema integrity,
 * relationships, and constraint distributions without modifying any data.
 * 
 * Usage: node scripts/verify-seed.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx > 0) {
        const key = trimmed.slice(0, equalsIdx).trim();
        const value = trimmed.slice(equalsIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadLocalEnv();

import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

async function verifySeed() {
  console.log("================================================================");
  console.log("🔍 RUNNING INDEPENDENT SEED VERIFICATION CHECK");
  console.log("================================================================");

  try {
    await connectDB();

    // 1. Users Check
    const users = await User.find({}).lean();
    const allUsersActiveAdmins = users.every((u) => u.role === "admin" && u.isActive === true);

    // 2. Jobs Check
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const draftJobs = await Job.countDocuments({ status: "draft" });
    const closedJobs = await Job.countDocuments({ status: "closed" });

    const jobSlugs = (await Job.find({}, "slug").lean()).map((j) => j.slug);
    const uniqueSlugs = new Set(jobSlugs);
    const duplicateJobSlugs = jobSlugs.length - uniqueSlugs.size;

    // 3. Applications Check
    const totalApps = await Application.countDocuments();
    const newApps = await Application.countDocuments({ status: "new" });
    const viewedApps = await Application.countDocuments({ status: "viewed" });

    const appIds = (await Application.find({}, "_id").lean()).map((a) => a._id.toString());
    const uniqueAppIds = new Set(appIds);
    const duplicateAppIds = appIds.length - uniqueAppIds.size;

    // 4. Relationships Check
    const allApplications = await Application.find({}).lean();
    let brokenJobReferences = 0;
    let mismatchedSlugOrTitle = 0;

    for (const app of allApplications) {
      const job = await Job.findById(app.jobId).lean();
      if (!job) {
        brokenJobReferences++;
      } else {
        if (job.slug !== app.jobSlug || job.title !== app.jobTitle || job.team !== app.jobTeam) {
          mismatchedSlugOrTitle++;
        }
      }
    }

    console.log(`Users:                               ${users.length}`);
    console.log(`  - All users admin & active:        ${allUsersActiveAdmins ? "YES" : "NO"}`);
    console.log(`Jobs:                                ${totalJobs} total`);
    console.log(`  - Active:                          ${activeJobs}`);
    console.log(`  - Draft:                           ${draftJobs}`);
    console.log(`  - Closed:                          ${closedJobs}`);
    console.log(`Applications:                        ${totalApps} total`);
    console.log(`  - New:                             ${newApps}`);
    console.log(`  - Viewed:                          ${viewedApps}`);
    console.log(`Broken job references:               ${brokenJobReferences}`);
    console.log(`Duplicate job slugs:                 ${duplicateJobSlugs}`);
    console.log(`Duplicate application IDs:           ${duplicateAppIds}`);
    console.log(`Mismatched denormalized job fields:  ${mismatchedSlugOrTitle}`);
    console.log("================================================================");

    const isAllValid =
      users.length > 0 &&
      allUsersActiveAdmins &&
      totalJobs === 8 &&
      activeJobs === 6 &&
      draftJobs === 1 &&
      closedJobs === 1 &&
      totalApps === 10 &&
      newApps === 6 &&
      viewedApps === 4 &&
      brokenJobReferences === 0 &&
      duplicateJobSlugs === 0 &&
      duplicateAppIds === 0 &&
      mismatchedSlugOrTitle === 0;

    if (isAllValid) {
      console.log("STATUS: ALL VERIFICATION CHECKS PASSED ✅");
    } else {
      console.error("STATUS: VERIFICATION CHECKS FAILED ❌");
      process.exit(1);
    }
  } catch (err) {
    console.error("Verification error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Connection closed.");
  }
}

verifySeed();
