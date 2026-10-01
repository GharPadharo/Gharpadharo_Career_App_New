import path from "path";
import fs from "fs";
import mongoose from "mongoose";

// Load environment configuration
import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import {
  getGoogleSheetsClient,
  isGoogleSheetsConfigured,
  formatSubmittedAt,
  formatApplicationForSheet,
  applySheetFormatting,
} from "../lib/googleSheets.js";
import Application from "../models/Application.js";
import ApplicationCounter from "../models/ApplicationCounter.js";
import { initializeApplicationCounter } from "../lib/applicationCounter.js";

async function runMigration() {
  console.log("==================================================");
  console.log("MIGRATION: APPLICATION ID & SHEETS REFINEMENT");
  console.log("==================================================\n");

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";

  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log(`✅ Connected to MongoDB (${MONGODB_DB_NAME})`);
  }

  // 1. Fetch all existing MongoDB applications sorted deterministically
  const mongoApps = await Application.find({}).sort({ createdAt: 1, _id: 1 });
  console.log(`Found ${mongoApps.length} application(s) in MongoDB.`);

  // 2. Fetch existing Google Sheet rows if configured
  let sheetRows = [];
  let sheets = null;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const tabName = (process.env.GOOGLE_SHEETS_TAB_NAME || "Applications").trim();

  if (isGoogleSheetsConfigured()) {
    sheets = getGoogleSheetsClient();
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A:R`,
    });
    sheetRows = sheetData.data.values || [];
    console.log(`Found ${sheetRows.length} row(s) in Google Sheet (including header).`);
  } else {
    console.log("⚠️ Google Sheets is not configured in this environment. Skipping sheet sync.");
  }

  let maxAssignedId = 0;

  // 3. If Google Sheet contains existing application rows (row 2 onwards)
  if (sheetRows.length > 1) {
    console.log("\n--- Migrating Existing Google Sheet Rows to Sequential IDs ---");
    const updatedRows = [];

    // Row 0 is the header row
    updatedRows.push(sheetRows[0]);

    for (let i = 1; i < sheetRows.length; i++) {
      const row = sheetRows[i];
      const sequentialId = i; // Row 2 -> ID 1, Row 3 -> ID 2, etc.
      const currentIdVal = row[0];

      maxAssignedId = Math.max(maxAssignedId, sequentialId);

      // Find matching MongoDB application
      const matchingMongo = mongoApps.find(
        (app) => app.applicationNumber === sequentialId || app._id.toString() === currentIdVal || (row[7] && app.email.toLowerCase() === row[7].toLowerCase())
      );

      if (matchingMongo) {
        if (!matchingMongo.applicationNumber) {
          matchingMongo.applicationNumber = sequentialId;
          await Application.updateOne({ _id: matchingMongo._id }, { $set: { applicationNumber: sequentialId } });
          console.log(`  Assigned applicationNumber ${sequentialId} to MongoDB app ${matchingMongo._id} (${matchingMongo.candidate})`);
        }
        // Regenerate complete row cleanly matching current schema and formatting
        const cleanRow = formatApplicationForSheet(matchingMongo);
        cleanRow[0] = sequentialId;
        updatedRows.push(cleanRow);
      } else {
        // Fallback for sheet-only row
        row[0] = sequentialId;
        if (row[1] && typeof row[1] === "string" && (row[1].includes("T") || row[1].includes("Z"))) {
          row[1] = `'${formatSubmittedAt(row[1])}`;
        }
        updatedRows.push(row);
      }
    }

    // Write updated rows back to Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1:R${updatedRows.length}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: updatedRows,
      },
    });
    console.log(`✅ Successfully updated ${updatedRows.length - 1} data row(s) in Google Sheet with sequential IDs.`);
  }

  // 4. Assign sequential applicationNumber to any remaining MongoDB applications
  console.log("\n--- Verifying MongoDB Application Numbers ---");
  for (const app of mongoApps) {
    if (!app.applicationNumber) {
      maxAssignedId += 1;
      app.applicationNumber = maxAssignedId;
      await Application.updateOne({ _id: app._id }, { $set: { applicationNumber: maxAssignedId } });
      console.log(`  Assigned applicationNumber ${maxAssignedId} to MongoDB app ${app._id} (${app.candidate})`);

      // If Google Sheet only has header row or is missing this app, append it
      if (sheets && sheetRows.length <= 1) {
        const rowValues = formatApplicationForSheet(app);
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${tabName}!A:R`,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [rowValues],
          },
        });
        console.log(`  Appended missing row for ID ${maxAssignedId} to Google Sheet.`);
      }
    } else {
      maxAssignedId = Math.max(maxAssignedId, app.applicationNumber);
    }
  }

  // 5. Initialize or update ApplicationCounter to maxAssignedId
  console.log("\n--- Initializing Persistent Application Counter ---");
  await ApplicationCounter.findOneAndUpdate(
    { _id: "application" },
    { $set: { sequence: maxAssignedId } },
    { upsert: true }
  );
  console.log(`✅ ApplicationCounter initialized to sequence: ${maxAssignedId}`);
  console.log(`Next new application will receive ID: ${maxAssignedId + 1}`);

  // 6. Apply sheet formatting (Header bold, data regular, Column A numeric)
  if (sheets) {
    console.log("\n--- Applying Sheet Font & Number Formatting ---");
    await applySheetFormatting(sheets, spreadsheetId, tabName);
    console.log("✅ Applied font formatting: Header row bold, Application rows regular, Column A numeric.");
  }

  console.log("\n==================================================");
  console.log("MIGRATION COMPLETED SUCCESSFULLY");
  console.log("==================================================");

  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
