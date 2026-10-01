import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load environment configuration
import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("GOOGLE SHEETS INTEGRATION & ID REFINEMENT TEST SUITE");
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

  // Import Google Sheets module & counter utility
  const {
    GOOGLE_SHEETS_HEADERS,
    isGoogleSheetsConfigured,
    formatApplicationForSheet,
    formatSubmittedAt,
    appendApplicationToSheet,
    normalizePrivateKey,
    getGoogleSheetsClient,
  } = await import("../lib/googleSheets.js");

  const {
    getNextApplicationNumber,
    getCurrentApplicationNumber,
    initializeApplicationCounter,
  } = await import("../lib/applicationCounter.js");

  // Connect to DB for tests
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  }

  const ApplicationModel = (await import("../models/Application.js")).default;
  const ApplicationCounterModel = (await import("../models/ApplicationCounter.js")).default;
  const JobModel = (await import("../models/Job.js")).default;

  const originalEnv = { ...process.env };
  const testAppIds = [];
  const testJobIds = [];

  try {
    // ----------------------------------------------------
    // 1. CONFIGURATION DETECTION & PRIVATE KEY NORMALIZATION
    // ----------------------------------------------------
    console.log("--- 1. Configuration Detection & Key Normalization ---");

    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    assert(!isGoogleSheetsConfigured(), "isGoogleSheetsConfigured returns false when env variables are missing");

    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "test_sheet_id";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "test@project.iam.gserviceaccount.com";
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgk...\\n-----END PRIVATE KEY-----";

    assert(isGoogleSheetsConfigured(), "isGoogleSheetsConfigured returns true when all 3 env variables are present");

    const cleanedKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    assert(cleanedKey.includes("\n") && !cleanedKey.includes("\\n"), "normalizePrivateKey successfully converts literal \\n to real newlines");

    // Restore env for remaining tests
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = originalEnv.GOOGLE_SHEETS_SPREADSHEET_ID;
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = originalEnv.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = originalEnv.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    // ----------------------------------------------------
    // 2. CANONICAL 18-COLUMN HEADER SCHEMA (REQUIREMENT 12)
    // ----------------------------------------------------
    console.log("\n--- 2. Canonical 18-Column Header Schema Verification (Req 12) ---");

    const expectedHeaders = [
      "Application ID",
      "Submitted At",
      "Application Type",
      "Position Applied For",
      "Team / Department",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Job Title",
      "Experience",
      "LinkedIn",
      "Portfolio",
      "Opportunity",
      "About",
      "Cover Letter",
      "Resume",
      "Status",
    ];

    assert(GOOGLE_SHEETS_HEADERS.length === 18, `Req 12: Exactly 18 columns defined in GOOGLE_SHEETS_HEADERS (got ${GOOGLE_SHEETS_HEADERS.length})`);

    const headersMatch = expectedHeaders.every((h, i) => GOOGLE_SHEETS_HEADERS[i] === h);
    assert(headersMatch, "Req 12: Columns match exact required names and order A through R");

    // ----------------------------------------------------
    // 3. SUBMITTED AT DATE + TIME FORMATTING (REQUIREMENT 11)
    // ----------------------------------------------------
    console.log("\n--- 3. Submitted At Formatting Verification (Req 11) ---");

    const sampleDate = new Date("2026-09-30T09:53:06.271Z");
    const formatted = formatSubmittedAt(sampleDate);
    assert(formatted === "30/09/2026 03:23 PM", `Req 11: Formatted date matches DD/MM/YYYY hh:mm AM/PM (got '${formatted}')`);
    assert(!formatted.includes("T"), "Req 11: Does not contain ISO 'T' separator");
    assert(!formatted.includes("Z"), "Req 11: Does not contain 'Z'");
    assert(!formatted.includes("."), "Req 11: Does not contain milliseconds");
    assert(!formatted.includes("GMT") && !formatted.includes("UTC"), "Req 11: Does not contain timezone string");

    // ----------------------------------------------------
    // 4. JOB & GENERAL FORMATTING & MAPPING (REQUIREMENTS 16, 17, 18)
    // ----------------------------------------------------
    console.log("\n--- 4. Job & General Application Formatting & Mapping (Req 16, 17, 18) ---");

    const mockJobApp = {
      _id: new mongoose.Types.ObjectId("65b123456789012345678901"),
      applicationNumber: 42,
      createdAt: sampleDate,
      applicationType: "job",
      jobTitle: "Senior Quality Analyst",
      jobTeam: "Quality Assurance",
      firstName: "Aarav",
      lastName: "Sharma",
      candidate: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 9876543210",
      currentJobTitle: "QA Lead",
      experience: "5 years",
      linkedin: "https://linkedin.com/in/aarav",
      portfolio: "https://aarav.dev",
      coverLetter: "I am passionate about software testing.",
      resume: {
        fileName: "Aarav_Sharma_Resume.pdf",
        fileUrl: "https://res.cloudinary.com/demo/image/upload/resume.pdf",
      },
      status: "new",
    };

    const jobRow = formatApplicationForSheet(mockJobApp);
    assert(jobRow.length === 18, `Req 16: Job row has exactly 18 cell values (got ${jobRow.length})`);
    assert(jobRow[0] === 42, `Req 16: Column A uses numeric integer applicationNumber (got ${jobRow[0]})`);
    assert(jobRow[1] === "'30/09/2026 03:23 PM", "Req 16: Column B has formatted date time");
    assert(jobRow[2] === "Job", "Req 16: Column C: Application Type is 'Job'");
    assert(jobRow[3] === "Senior Quality Analyst", "Req 16: Column D: Position Applied For contains job title");
    assert(jobRow[4] === "Quality Assurance", "Req 16: Column E: Team contains job team");
    assert(jobRow[5] === "Aarav" && jobRow[6] === "Sharma", "Req 16: Columns F & G: First and Last Name");
    assert(jobRow[8] === "'+91 9876543210", "Req 16: Column I: Phone escaped for Sheets");
    assert(jobRow[16] === "Aarav_Sharma_Resume.pdf", "Req 18: Resume behavior preserves human readable file name");
    assert(jobRow[17] === "New", "Req 16: Status is 'New'");

    const noResumeApp = { ...mockJobApp, resume: null };
    const noResumeRow = formatApplicationForSheet(noResumeApp);
    assert(noResumeRow[16] === "Not submitted", "Missing resume displays 'Not submitted'");

    const mockGenApp = {
      _id: new mongoose.Types.ObjectId("65b123456789012345678902"),
      applicationNumber: 43,
      createdAt: sampleDate,
      applicationType: "general",
      firstName: "Priya",
      lastName: "Patel",
      candidate: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 9123456780",
      currentJobTitle: "Frontend Intern",
      experience: "1-2 years",
      opportunityLookingFor: "Looking for React developer opportunities",
      aboutYourself: "Passionate about modern UI and accessibility",
      resume: "Priya_CV.docx",
      status: "new",
    };

    const genRow = formatApplicationForSheet(mockGenApp);
    assert(genRow.length === 18, `Req 17: General row has exactly 18 cell values (got ${genRow.length})`);
    assert(genRow[0] === 43, `Req 17: Column A uses numeric integer applicationNumber (got ${genRow[0]})`);
    assert(genRow[2] === "General", "Req 17: Application Type is 'General'");
    assert(genRow[3] === "—" && genRow[4] === "—", "Req 17: Position and Team are '—' for General Applications");
    assert(genRow[13] === "Looking for React developer opportunities", "Req 17: Opportunity field mapped correctly");
    assert(genRow[14] === "Passionate about modern UI and accessibility", "Req 17: About field mapped correctly");

    // ----------------------------------------------------
    // 5. ATOMIC COUNTER & CONCURRENCY SAFETY (REQUIREMENT 1, 2, 7)
    // ----------------------------------------------------
    console.log("\n--- 5. Atomic Counter & Concurrency Safety (Req 1, 2, 7) ---");

    const initialCounter = await getCurrentApplicationNumber();
    console.log(`Current application counter sequence: ${initialCounter}`);

    // Test concurrent increments
    const concurrentIncrements = 10;
    const promises = [];
    for (let i = 0; i < concurrentIncrements; i++) {
      promises.push(getNextApplicationNumber());
    }

    const results = await Promise.all(promises);
    const uniqueResults = new Set(results);

    assert(
      uniqueResults.size === concurrentIncrements,
      `Req 7: ${concurrentIncrements} concurrent calls generated exactly ${concurrentIncrements} unique IDs`
    );

    const minGenerated = Math.min(...results);
    const maxGenerated = Math.max(...results);
    assert(
      maxGenerated - minGenerated === concurrentIncrements - 1,
      `Req 7: Generated sequential IDs form a contiguous block from ${minGenerated} to ${maxGenerated}`
    );

    // ----------------------------------------------------
    // 6. SHARED SEQUENCE FOR JOB & GENERAL (REQUIREMENT 3)
    // ----------------------------------------------------
    console.log("\n--- 6. Shared Sequence for Job & General Applications (Req 3) ---");

    let testJob = await JobModel.findOne({ status: "active" }).lean();
    if (!testJob) {
      testJob = await JobModel.create({
        title: `QA Test Role ${Date.now()}`,
        team: "Quality Assurance",
        type: "Full-time",
        experience: "3+ years",
        location: "Bengaluru",
        workMode: "Hybrid",
        description: "Test job",
        status: "active",
      });
      testJobIds.push(testJob._id);
    }

    // Submit Job application
    const jobEmail = `seq-job-${Date.now()}@example.com`;
    const jobRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationType: "job",
        jobSlug: testJob.slug,
        firstName: "Aman",
        lastName: "Verma",
        email: jobEmail,
        phone: "+91 9911223344",
        experience: "3 years",
        coverLetter: "Excited about this QA role.",
        resume: { fileName: "Aman_Resume.pdf" },
        consent: true,
      }),
    });
    const jobJson = await jobRes.json();
    assert(jobRes.status === 201, "Submitted Job application successfully");
    const jobAppNumber = jobJson.application.applicationNumber;
    testAppIds.push(new mongoose.Types.ObjectId(jobJson.application.id));

    // Submit General application
    const genEmail = `seq-gen-${Date.now()}@example.com`;
    const genRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Kavita",
        lastName: "Rao",
        email: genEmail,
        phone: "+91 9922334455",
        opportunityLookingFor: "Marketing roles",
        aboutYourself: "Experienced brand marketer",
        resume: { fileName: "Kavita_Resume.pdf" },
        consent: true,
      }),
    });
    const genJson = await genRes.json();
    assert(genRes.status === 201, "Submitted General application successfully");
    const genAppNumber = genJson.application.applicationNumber;
    testAppIds.push(new mongoose.Types.ObjectId(genJson.application.id));

    assert(
      typeof jobAppNumber === "number" && typeof genAppNumber === "number",
      "Req 3: Both applications received numeric applicationNumbers"
    );
    assert(
      genAppNumber === jobAppNumber + 1,
      `Req 3: General app (${genAppNumber}) immediately succeeded Job app (${jobAppNumber}) in shared sequence`
    );

    // ----------------------------------------------------
    // 7. IMMUTABILITY OF APPLICATION NUMBER (REQUIREMENTS 8, 9, 10)
    // ----------------------------------------------------
    console.log("\n--- 7. Immutability of Application Number (Req 8, 9, 10) ---");

    const savedApp = await ApplicationModel.findById(jobJson.application.id);
    assert(
      savedApp.applicationNumber === jobAppNumber,
      `Req 8: Application number stored stably in MongoDB as ${savedApp.applicationNumber}`
    );

    // Change status
    savedApp.status = "viewed";
    savedApp.viewedAt = new Date();
    await savedApp.save();

    const reloadedApp = await ApplicationModel.findById(jobJson.application.id);
    assert(
      reloadedApp.applicationNumber === jobAppNumber,
      "Req 9 & 10: Application number does not change when status changes or application is viewed"
    );

    // ----------------------------------------------------
    // 8. DELETION DOES NOT DECREMENT COUNTER (REQUIREMENTS 4, 6)
    // ----------------------------------------------------
    console.log("\n--- 8. Deletion Does Not Decrement Counter (Req 4, 6) ---");

    const counterBeforeDelete = await getCurrentApplicationNumber();

    // Delete the application directly in MongoDB (as an admin delete would do)
    await ApplicationModel.deleteOne({ _id: savedApp._id });
    console.log(`Deleted application ID ${savedApp._id} (app number ${jobAppNumber}) from MongoDB`);

    const counterAfterDelete = await getCurrentApplicationNumber();
    assert(
      counterAfterDelete === counterBeforeDelete,
      `Req 4: Counter was NOT decremented after application deletion (remains ${counterAfterDelete})`
    );

    // Next application must receive counter + 1, NOT reusing deleted number
    const nextNum = await getNextApplicationNumber();
    assert(
      nextNum === counterBeforeDelete + 1,
      `Req 6: Next application continues with sequence number ${nextNum}, never reusing deleted ID ${jobAppNumber}`
    );

    // ----------------------------------------------------
    // 9. GOOGLE SHEETS LIVE FORMATTING & PERMANENCE (REQUIREMENTS 5, 13, 14)
    // ----------------------------------------------------
    console.log("\n--- 9. Google Sheets Live Formatting & Permanent Archive (Req 5, 13, 14) ---");

    if (isGoogleSheetsConfigured()) {
      const sheets = getGoogleSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

      const sheetMeta = await sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: true,
        ranges: ["Applications!A1:R5"],
      });

      const targetSheet = sheetMeta.data.sheets[0];
      assert(!targetSheet.tables || targetSheet.tables.length === 0, "No restricted Google Sheets Tables exist on sheet");
      assert(!targetSheet.dataValidation, "No sheet-wide data validation rules exist");

      // Verify Frozen Rows (top 2 rows: banner + column headers)
      assert(
        targetSheet.properties?.gridProperties?.frozenRowCount === 2,
        "Req 12: Top 2 rows are frozen (Title Banner + Table Column Headers)"
      );

      // Verify Native Filter is enabled on column headers
      assert(
        Boolean(targetSheet.basicFilter),
        "Req 13: Native filter controls enabled on header row"
      );

      // Verify Alternating Banding is configured
      assert(
        targetSheet.bandedRanges && targetSheet.bandedRanges.length > 0,
        "Alternating row banding (zebra striping) configured"
      );

      const rows = targetSheet.data[0].rowData;
      const bannerCell = rows[0]?.values?.[0];
      const headerCell = rows[1]?.values?.[0]; // Row 2: "Application ID" header
      const dataCell = rows[2]?.values?.[0];   // Row 3: First appended candidate data row

      assert(
        bannerCell?.formattedValue?.includes("GharPadharo") && bannerCell?.formattedValue?.includes("DEVELOPMENT"),
        "Req 2: Title banner displayed with GharPadharo brand and DEVELOPMENT badge"
      );

      assert(
        headerCell?.effectiveFormat?.textFormat?.bold === true,
        "Req 14: Header row remains bold (bold: true)"
      );

      assert(
        dataCell?.effectiveFormat?.textFormat?.bold === false,
        "Req 13: Application data rows are regular font weight (bold: false)"
      );

      assert(
        dataCell?.effectiveFormat?.numberFormat?.type === "NUMBER",
        "Req 13: Application ID column has NUMBER format"
      );

      // Verify appended data row has no People chip or validation error, and has a clickable resume link
      const populatedRows = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Applications!A:R",
      });
      const lastRowIdx = populatedRows.data.values?.length || 2;
      const lastRowMeta = await sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: true,
        ranges: [`Applications!A${lastRowIdx}:R${lastRowIdx}`],
      });
      const lastRowCells = lastRowMeta.data.sheets[0].data[0]?.rowData?.[0]?.values;
      if (lastRowCells) {
        const emailCell = lastRowCells[7];
        assert(
          Boolean(emailCell?.formattedValue),
          `Candidate email present in sheet: '${emailCell?.formattedValue}'`
        );
        assert(
          !emailCell?.dataValidation,
          "Email cell has no People chip or data validation rule"
        );

        // Verify Resume (Column Q) has clickable hyperlink pointing to secure resume route
        const resumeCell = lastRowCells[16];
        assert(
          Boolean(resumeCell?.formattedValue),
          `Resume cell displays human-readable filename: '${resumeCell?.formattedValue}'`
        );
        assert(
          typeof resumeCell?.hyperlink === "string" &&
            resumeCell.hyperlink.includes("/api/admin/applications/") &&
            resumeCell.hyperlink.endsWith("/resume"),
          `Resume is a clickable hyperlink to secure route (got '${resumeCell?.hyperlink}')`
        );
        assert(
          resumeCell?.effectiveFormat?.textFormat?.bold === false,
          "Resume text remains regular font weight (bold: false)"
        );
      }

      // Verify secure route rejects unauthenticated access
      const unauthResumeRes = await fetch(`${BASE_URL}/api/admin/applications/11/resume`);
      assert(
        unauthResumeRes.status === 401,
        `Secure resume route enforces admin authentication (got HTTP ${unauthResumeRes.status})`
      );

      // Verify Google Sheets permanent archive: previous applications remain in sheet
      const allRows = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Applications!A:B",
      });
      assert(
        allRows.data.values?.length > 1,
        "Req 5: Google Sheet rows remain intact as a permanent recruitment archive"
      );
    } else {
      console.log("Skipping live Google Sheets check (unconfigured).");
    }

    // ----------------------------------------------------
    // 10. SAFE FAILURE HANDLING (REQUIREMENT 15)
    // ----------------------------------------------------
    console.log("\n--- 10. Safe Failure Handling Verification (Req 15) ---");

    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    const unconfRes = await appendApplicationToSheet(mockJobApp);
    assert(
      unconfRes.success === false && unconfRes.skipped === true,
      "Req 15: Google Sheets sync failure skips gracefully without breaking submission"
    );

  } finally {
    // Restore original env
    process.env = originalEnv;

    // Clean up temporary database fixtures
    console.log("\n--- Clean Up Test Records ---");
    if (testAppIds.length > 0) {
      await ApplicationModel.deleteMany({ _id: { $in: testAppIds } });
      console.log(`Cleaned up ${testAppIds.length} test applications from MongoDB.`);
    }
    if (testJobIds.length > 0) {
      await JobModel.deleteMany({ _id: { $in: testJobIds } });
      console.log(`Cleaned up ${testJobIds.length} test jobs from MongoDB.`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
