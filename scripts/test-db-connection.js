/**
 * Standalone Database Connection Test Script
 * 
 * Verifies MongoDB connectivity using Mongoose without affecting Next.js runtime.
 * Usage: node scripts/test-db-connection.js
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Parse .env.local manually if dotenv is not installed
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

async function testConnection() {
  loadLocalEnv();

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "gharpadharo_careers";

  console.log("==========================================");
  console.log("MONGODB CONNECTION TEST");
  console.log("==========================================");

  if (!uri || !uri.trim()) {
    console.log("STATUS: SKIPPED (No MONGODB_URI provided)");
    console.log("Reason: MONGODB_URI is empty or not configured in .env.local.");
    console.log("Action: When you are ready to connect to MongoDB Atlas, add your URI to .env.local and rerun this script.");
    console.log("==========================================");
    return;
  }

  console.log("Attempting to connect to MongoDB Atlas...");
  console.log(`Target Database: ${dbName}`);

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("STATUS: SUCCESS");
    console.log(`Connected successfully to host: ${conn.connection.host}`);
    console.log(`Ready State: ${conn.connection.readyState} (1 = Connected)`);

    await mongoose.disconnect();
    console.log("Connection closed cleanly.");
    console.log("==========================================");
  } catch (error) {
    console.error("STATUS: FAILED");
    console.error(`Connection error: ${error.message}`);
    console.log("==========================================");
  }
}

testConnection();
