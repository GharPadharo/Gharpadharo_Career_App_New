import mongoose from "mongoose";

import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import { getGoogleSheetsClient, applySheetFormatting } from "../lib/googleSheets.js";
import Application from "../models/Application.js";
import ApplicationCounter from "../models/ApplicationCounter.js";
import Job from "../models/Job.js";

async function runRealVerification() {
  console.log("==================================================");
  console.log("13. REAL DEVELOPMENT VERIFICATION");
  console.log("==================================================\n");

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheets = getGoogleSheetsClient();

  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  }

  // ----------------------------------------------------
  // STEP A & B: CHECK SHEET & CONFIRM EXISTING ROWS (1 to 7)
  // ----------------------------------------------------
  console.log("--- Step A & B: Check Development Google Sheet & Ensure 7 Initial Rows ---");

  // Clear any temporary rows above 8 if present so sheet has exactly 7 development rows
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: "Applications!A9:R50",
  });

  // Re-read rows 1 to 8
  const checkRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Applications!A1:R8",
  });

  const existingRows = checkRes.data.values || [];
  console.log(`Total rows in Google Sheet: ${existingRows.length} (1 header + ${existingRows.length - 1} data rows)`);
  
  for (let i = 1; i < existingRows.length; i++) {
    console.log(`  Row ${i + 1} -> ID: ${existingRows[i][0]} | Type: ${existingRows[i][2]} | Candidate: ${existingRows[i][5]} ${existingRows[i][6]} | SubmittedAt: ${existingRows[i][1]}`);
  }

  // Initialize counter to highest existing ID = 7
  await ApplicationCounter.findOneAndUpdate(
    { _id: "application" },
    { $set: { sequence: 7 } },
    { upsert: true }
  );
  console.log("✅ Initialized ApplicationCounter sequence to 7.");

  // Also apply font formatting to sheet
  await applySheetFormatting(sheets, SPREADSHEET_ID, "Applications");

  // ----------------------------------------------------
  // STEP C: SUBMIT ONE NEW JOB APPLICATION (EXPECTED: 8)
  // ----------------------------------------------------
  console.log("\n--- Step C: Submit One New Job Application (Expected ID: 8) ---");

  const activeJob = await Job.findOne({ status: "active" }).lean();
  if (!activeJob) throw new Error("No active job found");

  const jobCandidate = {
    applicationType: "job",
    jobSlug: activeJob.slug,
    firstName: "Aditya",
    lastName: "Kapoor",
    email: `aditya.kapoor.${Date.now()}@example.com`,
    phone: "+91 9811223344",
    currentJobTitle: "Senior Software Engineer",
    experience: "4 years",
    linkedin: "https://linkedin.com/in/adityakapoor",
    portfolio: "https://adityakapoor.dev",
    coverLetter: "Excited to join the engineering team at GharPadharo.",
    resume: {
      fileName: "Aditya_Kapoor_Resume.pdf",
      fileSize: 102400,
      mimeType: "application/pdf",
    },
    consent: true,
  };

  const jobPostRes = await fetch("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobCandidate),
  });
  const jobPostJson = await jobPostRes.json();
  console.log("Job application response status:", jobPostRes.status);
  console.log("Job application returned ID:", jobPostJson.application?.id, "applicationNumber:", jobPostJson.application?.applicationNumber);

  if (jobPostJson.application?.applicationNumber !== 8) {
    throw new Error(`Expected Application ID 8, got ${jobPostJson.application?.applicationNumber}`);
  }
  console.log("✅ PASS: New Job Application received Application ID: 8");
  const app8Id = jobPostJson.application.id;

  // ----------------------------------------------------
  // STEP D: SUBMIT ONE GENERAL APPLICATION (EXPECTED: 9)
  // ----------------------------------------------------
  console.log("\n--- Step D: Submit One General Application (Expected ID: 9) ---");

  const genCandidate = {
    applicationType: "general",
    firstName: "Riya",
    lastName: "Sen",
    email: `riya.sen.${Date.now()}@example.com`,
    phone: "+91 9822334455",
    currentJobTitle: "Product Growth Specialist",
    experience: "3 years",
    opportunityLookingFor: "Growth and Operations roles",
    aboutYourself: "Passionate about scaling consumer platforms",
    resume: {
      fileName: "Riya_Sen_Resume.pdf",
      fileSize: 153600,
      mimeType: "application/pdf",
    },
    consent: true,
  };

  const genPostRes = await fetch("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(genCandidate),
  });
  const genPostJson = await genPostRes.json();
  console.log("General application response status:", genPostRes.status);
  console.log("General application returned ID:", genPostJson.application?.id, "applicationNumber:", genPostJson.application?.applicationNumber);

  if (genPostJson.application?.applicationNumber !== 9) {
    throw new Error(`Expected Application ID 9, got ${genPostJson.application?.applicationNumber}`);
  }
  console.log("✅ PASS: New General Application received Application ID: 9");

  // ----------------------------------------------------
  // STEP E: DELETE APPLICATION 8 FROM MONGODB (ADMIN DELETION)
  // ----------------------------------------------------
  console.log("\n--- Step E: Delete Application 8 (Admin Deletion Flow) ---");

  // Deleting application 8 from MongoDB (mimicking admin delete action)
  const delRes = await Application.deleteOne({ _id: app8Id });
  console.log(`Deleted Application 8 from MongoDB: acknowledged=${delRes.acknowledged}, deletedCount=${delRes.deletedCount}`);

  // Confirm Application 8 is gone from MongoDB
  const findMongo8 = await Application.findById(app8Id);
  console.log("Checking MongoDB for Application 8:", findMongo8 ? "FOUND (Unexpected)" : "NOT FOUND (Correct)");
  if (findMongo8) throw new Error("Application 8 was not deleted from MongoDB!");

  // Confirm Google Sheet row with Application ID 8 remains permanently
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const sheetAfterDel = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Applications!A9:R10",
  });
  const row8 = sheetAfterDel.data.values?.[0];
  console.log("Google Sheet Row 9 (Application 8):", row8?.slice(0, 7));

  if (!row8 || Number(row8[0]) !== 8) {
    throw new Error(`Expected Google Sheet row with Application ID 8 to remain! Got: ${row8?.[0]}`);
  }
  console.log("✅ PASS: Google Sheet row with Application ID 8 remains permanently in the sheet!");

  // ----------------------------------------------------
  // STEP F: SUBMIT ANOTHER APPLICATION (EXPECTED: 10, NOT 8)
  // ----------------------------------------------------
  console.log("\n--- Step F: Submit Another Application (Expected ID: 10, NOT 8) ---");

  const nextCandidate = {
    applicationType: "job",
    jobSlug: activeJob.slug,
    firstName: "Tarun",
    lastName: "Mehta",
    email: `tarun.mehta.${Date.now()}@example.com`,
    phone: "+91 9833445566",
    currentJobTitle: "Full Stack Developer",
    experience: "5 years",
    coverLetter: "Looking forward to working with the team.",
    resume: {
      fileName: "Tarun_Mehta_Resume.pdf",
    },
    consent: true,
  };

  const nextPostRes = await fetch("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nextCandidate),
  });
  const nextPostJson = await nextPostRes.json();
  console.log("Next application response status:", nextPostRes.status);
  console.log("Next application returned ID:", nextPostJson.application?.id, "applicationNumber:", nextPostJson.application?.applicationNumber);

  if (nextPostJson.application?.applicationNumber !== 10) {
    throw new Error(`Expected Application ID 10, got ${nextPostJson.application?.applicationNumber}`);
  }
  console.log("✅ PASS: Next application received Application ID: 10 (NOT 8)!");

  // ----------------------------------------------------
  // FINAL SHEET STATE INSPECTION
  // ----------------------------------------------------
  console.log("\n--- Final Google Sheet Inspection ---");
  const finalSheetRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Applications!A1:I12",
  });
  console.log(`Total rows in Google Sheet: ${finalSheetRes.data.values.length}`);
  finalSheetRes.data.values.forEach((r, idx) => {
    console.log(`  Row ${idx + 1}: ID=${r[0]} | SubmittedAt="${r[1]}" | Type=${r[2]} | Position="${r[3]}" | Candidate="${r[5]} ${r[6]}"`);
  });

  // Verify font weights
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    includeGridData: true,
    ranges: ["Applications!A1:R11"],
  });
  const rows = meta.data.sheets[0].data[0].rowData;
  console.log("\nFont Weight Verification:");
  console.log("  Header Row (Row 1) bold:", rows[0].values[0].effectiveFormat?.textFormat?.bold);
  console.log("  Row 9 (App ID 8) bold:", rows[8].values[0].effectiveFormat?.textFormat?.bold);
  console.log("  Row 10 (App ID 9) bold:", rows[9].values[0].effectiveFormat?.textFormat?.bold);
  console.log("  Row 11 (App ID 10) bold:", rows[10].values[0].effectiveFormat?.textFormat?.bold);

  console.log("\n==================================================");
  console.log("🎉 ALL REAL DEVELOPMENT VERIFICATION STEPS PASSED!");
  console.log("==================================================");

  await mongoose.disconnect();
}

runRealVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
