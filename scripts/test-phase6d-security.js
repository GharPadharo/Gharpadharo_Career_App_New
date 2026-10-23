/**
 * Phase 6D Verification Suite:
 * - Google Sheets Formula Injection Protection (sanitizeForGoogleSheets & formatApplicationForSheet)
 * - Resume Route Cache-Control Policy
 *
 * Strictly local, non-destructive, zero external API calls.
 */

import assert from "assert";
import http from "http";
import {
  sanitizeForGoogleSheets,
  formatApplicationForSheet,
  GOOGLE_SHEETS_HEADERS,
} from "../lib/googleSheets.js";

async function runTests() {
  console.log("=================================================");
  console.log("PHASE 6D: FORMULA INJECTION & CACHE POLICY TESTS ");
  console.log("=================================================\n");

  let passedCount = 0;
  let totalCount = 0;

  function test(name, fn) {
    totalCount++;
    try {
      fn();
      passedCount++;
      console.log(`✅ PASS: ${name}`);
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      process.exitCode = 1;
    }
  }

  // ====================================================
  // TEST SUITE 1: Formula Injection Sanitizer Unit Tests
  // ====================================================
  console.log("--- 1. Formula Prefix Detection & Escaping ---");

  test("Escapes equals sign '=' formula prefix", () => {
    const input = "=SUM(1,2)";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'=SUM(1,2)");
  });

  test("Escapes plus sign '+' formula prefix", () => {
    const input = "+cmd|' /C calc'!A0";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'+cmd|' /C calc'!A0");
  });

  test("Escapes minus sign '-' formula prefix", () => {
    const input = "-2+3+cmd|' /C calc'!A0";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'-2+3+cmd|' /C calc'!A0");
  });

  test("Escapes at sign '@' formula prefix", () => {
    const input = "@SUM(A1:A10)";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'@SUM(A1:A10)");
  });

  test("Escapes horizontal tab '\\t' prefix", () => {
    const input = "\t=1+1";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'\t=1+1");
  });

  test("Escapes carriage return '\\r' and newline '\\n' prefixes", () => {
    const input = "\r\n=1+1";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'\r\n=1+1");
  });

  console.log("\n--- 2. Leading Whitespace + Trigger Characters ---");

  test("Escapes formula with leading spaces", () => {
    const input = "   =SUM(1,2)";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'   =SUM(1,2)");
  });

  test("Escapes formula with leading tabs and spaces", () => {
    const input = "\t  +cmd|' /C calc'!A0";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'\t  +cmd|' /C calc'!A0");
  });

  test("Escapes formula with leading newlines and spaces", () => {
    const input = "\n  -12345";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'\n  -12345");
  });

  console.log("\n--- 3. Legitimate Phone Numbers & Text Preservation ---");

  test("Protects international phone number starting with '+' as text", () => {
    const input = "+91 9876543210";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'+91 9876543210");
  });

  test("Preserves domestic phone number starting with digit without prepending quote", () => {
    const input = "0135-2654321";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "0135-2654321");
  });

  test("Preserves standard candidate name without modification", () => {
    const input = "Aarav Sharma";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "Aarav Sharma");
  });

  test("Preserves job title with embedded plus signs (C++ Developer)", () => {
    const input = "C++ Systems Engineer";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "C++ Systems Engineer");
  });

  test("Preserves text containing em-dash and Unicode characters", () => {
    const input = "Infrastructure — DevOps & Security (हिंदी)";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "Infrastructure — DevOps & Security (हिंदी)");
  });

  console.log("\n--- 4. Edge Cases, Numbers, and Fallbacks ---");

  test("Preserves numeric integer (applicationNumber)", () => {
    const output = sanitizeForGoogleSheets(42);
    assert.strictEqual(output, 42);
  });

  test("Preserves numeric zero", () => {
    const output = sanitizeForGoogleSheets(0);
    assert.strictEqual(output, 0);
  });

  test("Returns fallback '—' on empty string", () => {
    const output = sanitizeForGoogleSheets("");
    assert.strictEqual(output, "—");
  });

  test("Returns fallback '—' on null", () => {
    const output = sanitizeForGoogleSheets(null);
    assert.strictEqual(output, "—");
  });

  test("Returns fallback '—' on undefined", () => {
    const output = sanitizeForGoogleSheets(undefined);
    assert.strictEqual(output, "—");
  });

  test("Returns custom fallback when provided", () => {
    const output = sanitizeForGoogleSheets("", "Not submitted");
    assert.strictEqual(output, "Not submitted");
  });

  test("Does not double-prepend quote if string already starts with apostrophe", () => {
    const input = "'=ALREADY_QUOTED";
    const output = sanitizeForGoogleSheets(input);
    assert.strictEqual(output, "'=ALREADY_QUOTED");
  });

  // ====================================================
  // TEST SUITE 2: Full Row Formatting with Injected Payloads
  // ====================================================
  console.log("\n--- 5. Full Application Row Formatting with Injected Payloads ---");

  test("Sanitizes malicious formula payloads across all applicant fields", () => {
    const maliciousApp = {
      applicationNumber: 101,
      applicationType: "job",
      jobTitle: "=cmd|' /C calc'!A0",
      jobTeam: "+Engineering_Exfil",
      firstName: "=SUM(1,2)",
      lastName: "-danger_last",
      email: "@attacker.domain",
      phone: "+91 9999999999",
      currentJobTitle: "   =HYPERLINK(\"http://evil.com\", \"Click\")",
      experience: "\t=5+5",
      linkedin: "\r+https://linkedin.com/in/malicious",
      portfolio: "@https://portfolio.com",
      opportunityLookingFor: "=opportunity_formula",
      aboutYourself: "  -about_formula",
      coverLetter: "=cmd|' /C calc'!A0\nMulti-line payload",
      resume: {
        fileName: "=malicious_resume.pdf",
      },
    };

    const row = formatApplicationForSheet(maliciousApp);
    assert.strictEqual(row.length, 17, "Row has 17 values");

    // Verify Column A is integer 101
    assert.strictEqual(row[0], 101);

    // Verify all text columns have formula protection
    const FORMULA_TRIGGER_UNSAFE = /^[\s\t\r\n]*[=+\-@\t\r\n]/;
    for (let cIdx = 3; cIdx < 17; cIdx++) {
      const cell = String(row[cIdx]);
      // If the cell was meant to be a formula payload, it must start with an apostrophe
      if (cell !== "—") {
        assert(
          cell.startsWith("'") || !FORMULA_TRIGGER_UNSAFE.test(cell),
          `Column ${GOOGLE_SHEETS_HEADERS[cIdx]} (${cIdx}) must be safe from formula execution (got: ${cell})`
        );
      }
    }

    assert.strictEqual(row[3], "'=cmd|' /C calc'!A0", "Job Title sanitized");
    assert.strictEqual(row[4], "'+Engineering_Exfil", "Team sanitized");
    assert.strictEqual(row[5], "'=SUM(1,2)", "First Name sanitized");
    assert.strictEqual(row[6], "'-danger_last", "Last Name sanitized");
    assert.strictEqual(row[7], "'@attacker.domain", "Email sanitized");
    assert.strictEqual(row[8], "'+91 9999999999", "Phone sanitized");
    assert.strictEqual(row[9], "'=HYPERLINK(\"http://evil.com\", \"Click\")", "Current Job Title sanitized (trimmed and escaped)");
    assert.strictEqual(row[10], "'=5+5", "Experience sanitized (trimmed and escaped)");
    assert.strictEqual(row[11], "'+https://linkedin.com/in/malicious", "LinkedIn sanitized (trimmed and escaped)");
    assert.strictEqual(row[12], "'@https://portfolio.com", "Portfolio sanitized");
    assert.strictEqual(row[15], "'=cmd|' /C calc'!A0\nMulti-line payload", "Cover Letter sanitized");
    assert.strictEqual(row[16], "'=malicious_resume.pdf", "Resume filename sanitized");
  });

  // ====================================================
  // TEST SUITE 3: Resume Endpoint Cache-Control Verification
  // ====================================================
  console.log("\n--- 6. Resume Endpoint Cache-Control Verification ---");

  await new Promise((resolve) => {
    http.get(
      "http://localhost:3000/api/resumes/0000000000000000000000000000000000000000000000000000000000000000",
      (res) => {
        test("Resume endpoint returns HTTP 404 for nonexistent token", () => {
          assert.strictEqual(res.statusCode, 404);
        });

        test("Resume endpoint sets 'Cache-Control: no-store, private'", () => {
          const cacheHeader = res.headers["cache-control"];
          assert(
            cacheHeader && cacheHeader.includes("no-store") && cacheHeader.includes("private"),
            `Expected 'no-store, private' in Cache-Control header (got: ${cacheHeader})`
          );
        });

        test("Resume endpoint error response does not disclose candidate/token details", (done) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const json = JSON.parse(body);
              assert.strictEqual(json.success, false);
              assert.strictEqual(
                json.error,
                "Resume link is invalid, expired, or has been revoked."
              );
              resolve();
            } catch (err) {
              console.error(err);
              process.exitCode = 1;
              resolve();
            }
          });
        });
      }
    ).on("error", (err) => {
      console.warn("Notice: Dev server not reachable on :3000. Skipping live HTTP check.", err.message);
      resolve();
    });
  });

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passedCount} / ${totalCount} PASSED`);
  console.log("=================================================\n");
}

runTests();
