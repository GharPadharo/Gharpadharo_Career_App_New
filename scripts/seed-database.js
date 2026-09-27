/**
 * ==============================================================================
 * DEVELOPMENT DATABASE SEED SCRIPT (Phase 2C.1)
 * ==============================================================================
 * 
 * Populates the development MongoDB Atlas database with canonical frontend
 * mock data from lib/mockJobs.js and lib/mockApplications.js.
 * 
 * WARNING:
 * - This script is for DEVELOPMENT USE ONLY.
 * - It clears ONLY the `users`, `jobs`, and `applications` collections before seeding.
 * - It does NOT upload any real resume files or create fake Cloudinary assets.
 * - It is idempotent and safe to run multiple times.
 * 
 * Usage: node scripts/seed-database.js
 * ==============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Resolve directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually load .env.local if not already in process.env
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

// 2. Import Connection Helper, Models, and Mock Data
import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { mockJobs } from "../lib/mockJobs.js";
import { mockApplications } from "../lib/mockApplications.js";

async function seedDatabase() {
  console.log("================================================================");
  console.log("⚠️  GHARPADHARO CAREER PORTAL — DEVELOPMENT DATABASE SEEDING");
  console.log("================================================================");
  console.log("WARNING: This will clear ONLY the following development collections:");
  console.log("  - users");
  console.log("  - jobs");
  console.log("  - applications");
  console.log("================================================================\n");

  try {
    // Connect to MongoDB Atlas
    console.log("1. Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("   ✓ Connected successfully.\n");

    // Clear existing development collections (Idempotency)
    console.log("2. Clearing existing development collections...");
    const deletedUsers = await User.deleteMany({});
    const deletedJobs = await Job.deleteMany({});
    const deletedApps = await Application.deleteMany({});
    console.log(`   ✓ Deleted ${deletedUsers.deletedCount} old user(s).`);
    console.log(`   ✓ Deleted ${deletedJobs.deletedCount} old job(s).`);
    console.log(`   ✓ Deleted ${deletedApps.deletedCount} old application(s).\n`);

    // 3. Seed Development Admin Users from ADMIN_EMAILS
    console.log("3. Seeding development admin user(s)...");
    const rawAdminEmails = process.env.ADMIN_EMAILS || "admin@gharpadharo.com";
    const adminEmails = rawAdminEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.length === 0) {
      adminEmails.push("admin@gharpadharo.com");
    }

    const seededUsers = [];
    for (const email of adminEmails) {
      // Derive a clean display name from local part
      const localPart = email.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = localPart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const user = await User.create({
        email,
        name: formattedName || "Development Admin",
        role: "admin",
        isActive: true,
        lastLoginAt: new Date(),
      });
      seededUsers.push(user);
      console.log(`   ✓ Created Admin: ${user.email} (ID: ${user._id})`);
    }

    const primaryAdmin = seededUsers[0];
    console.log(`   ✓ Primary admin reference assigned to: ${primaryAdmin.email}\n`);

    // 4. Seed Jobs from mockJobs.js
    console.log("4. Seeding 8 jobs from canonical mockJobs.js...");
    const jobSlugToDbJobMap = new Map();

    for (const mockJob of mockJobs) {
      // Infer workMode if not explicitly set
      let workMode = "Remote";
      const loc = (mockJob.location || "").toLowerCase();
      if (loc.includes("on-site") || loc.includes("onsite") || loc.includes("dehradun")) {
        workMode = "On-site";
      } else if (loc.includes("hybrid")) {
        workMode = "Hybrid";
      }

      // Calculate postedAt from postedDays
      const postedDays = mockJob.postedDays || 0;
      const postedAt = new Date(Date.now() - postedDays * 24 * 60 * 60 * 1000);

      const jobDoc = await Job.create({
        slug: mockJob.id,
        title: mockJob.title,
        team: mockJob.team,
        type: mockJob.type,
        experience: mockJob.experience,
        location: mockJob.location,
        workMode,
        description: mockJob.description,
        responsibilities: mockJob.responsibilities || [],
        skills: mockJob.skills || [],
        requirements: mockJob.requirements || [],
        tags: mockJob.tags || [],
        status: (mockJob.status || "active").toLowerCase(),
        postedAt,
        createdById: primaryAdmin._id,
        updatedById: primaryAdmin._id,
      });

      jobSlugToDbJobMap.set(jobDoc.slug, jobDoc);
      console.log(`   ✓ Job [${jobDoc.status.toUpperCase()}]: ${jobDoc.title} (slug: ${jobDoc.slug})`);
    }
    console.log(`   ✓ Successfully seeded ${jobSlugToDbJobMap.size} jobs.\n`);

    // 5. Seed Applications from mockApplications.js
    console.log("5. Seeding 10 applications from canonical mockApplications.js...");
    let seededAppsCount = 0;
    let newAppsCount = 0;
    let viewedAppsCount = 0;

    for (const mockApp of mockApplications) {
      const referencedJob = jobSlugToDbJobMap.get(mockApp.jobId);
      if (!referencedJob) {
        throw new Error(`Referenced job with slug "${mockApp.jobId}" not found in seeded jobs!`);
      }

      // Split candidate name into first and last name
      const nameParts = (mockApp.candidate || "").trim().split(" ");
      const firstName = nameParts[0] || "Candidate";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "Candidate";

      // Preserve status (new vs. viewed)
      const isViewed = (mockApp.status || "").toLowerCase() === "viewed";
      if (isViewed) {
        viewedAppsCount++;
      } else {
        newAppsCount++;
      }

      const appliedDate = mockApp.appliedAt ? new Date(mockApp.appliedAt) : new Date();

      // Development placeholder for resume metadata (NO fake Cloudinary upload)
      const resumeMetadata = {
        fileName: mockApp.resume || `${mockApp.id}-resume.pdf`,
        fileUrl: "", // Explicit empty placeholder for development
        publicId: "", // Explicit empty placeholder for development
        fileSize: 0, // Placeholder
        mimeType: "application/pdf",
      };

      const appDoc = await Application.create({
        jobId: referencedJob._id,
        jobSlug: referencedJob.slug,
        jobTitle: referencedJob.title,
        jobTeam: referencedJob.team,
        firstName,
        lastName,
        candidate: mockApp.candidate,
        email: mockApp.email.toLowerCase().trim(),
        phone: mockApp.phone,
        currentJobTitle: "",
        experience: mockApp.experience,
        linkedin: mockApp.linkedin || "",
        portfolio: mockApp.portfolio || "",
        coverLetter: mockApp.coverLetter || "",
        resume: resumeMetadata,
        consent: true,
        status: isViewed ? "viewed" : "new",
        viewedAt: isViewed ? appliedDate : undefined,
        viewedBy: isViewed ? primaryAdmin._id : undefined,
        createdAt: appliedDate,
        updatedAt: appliedDate,
      });

      seededAppsCount++;
      console.log(`   ✓ App [${appDoc.status.toUpperCase()}]: ${appDoc.candidate} -> ${appDoc.jobTitle}`);
    }
    console.log(`   ✓ Successfully seeded ${seededAppsCount} applications (${newAppsCount} new, ${viewedAppsCount} viewed).\n`);

    // 6. Comprehensive Verification Summary
    console.log("================================================================");
    console.log("📊 SEEDING & INTEGRITY VERIFICATION SUMMARY");
    console.log("================================================================");

    const totalUsers = await User.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const draftJobs = await Job.countDocuments({ status: "draft" });
    const closedJobs = await Job.countDocuments({ status: "closed" });
    const totalJobs = await Job.countDocuments();

    const totalApps = await Application.countDocuments();
    const dbNewApps = await Application.countDocuments({ status: "new" });
    const dbViewedApps = await Application.countDocuments({ status: "viewed" });

    // Check relationship integrity
    const allApps = await Application.find({}).lean();
    let brokenReferences = 0;
    for (const app of allApps) {
      const exists = await Job.exists({ _id: app.jobId });
      if (!exists) brokenReferences++;
    }

    // Check for duplicate slugs
    const allJobSlugs = (await Job.find({}, "slug").lean()).map((j) => j.slug);
    const uniqueSlugs = new Set(allJobSlugs);
    const duplicateJobSlugs = allJobSlugs.length - uniqueSlugs.size;

    console.log(`Users:                         ${totalUsers} (Role: admin, isActive: true)`);
    console.log(`Jobs:                          ${totalJobs} total`);
    console.log(`  - Active:                    ${activeJobs}`);
    console.log(`  - Draft:                     ${draftJobs}`);
    console.log(`  - Closed:                    ${closedJobs}`);
    console.log(`Applications:                  ${totalApps} total`);
    console.log(`  - New:                       ${dbNewApps}`);
    console.log(`  - Viewed:                    ${dbViewedApps}`);
    console.log(`Broken job references:         ${brokenReferences}`);
    console.log(`Duplicate job slugs:           ${duplicateJobSlugs}`);
    console.log(`Real resume files uploaded:    0 (Strictly avoided, placeholder metadata used)`);
    console.log("================================================================");
    console.log("✅ DEVELOPMENT DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("================================================================\n");

  } catch (error) {
    console.error("\n❌ SEEDING FAILED:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed cleanly.");
  }
}

seedDatabase();
