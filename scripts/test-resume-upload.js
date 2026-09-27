import fs from "fs";
import path from "path";

// Load .env.local if present
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
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // Ignore
}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 2F: RESUME UPLOAD / CLOUDINARY VERIFICATION");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  function skip(message) {
    console.log(`ℹ️ SKIP: ${message}`);
    skipped++;
  }

  /**
   * Generates a genuinely valid, standards-compliant minimal PDF binary fixture.
   * Includes valid Catalog, Page tree, Content stream, font resources, and exact xref table.
   */
  function createMinimalValidPdf(title = "Candidate Resume") {
    const streamContent = `BT\n/F1 18 Tf\n50 700 Td\n(${title}) Tj\nET\n`;
    const streamLength = Buffer.byteLength(streamContent, "utf-8");

    let pdf = "%PDF-1.4\n";
    const offsets = [];

    function addObj(content) {
      offsets.push(Buffer.byteLength(pdf, "utf-8"));
      pdf += content + "\n";
    }

    addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
    addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
    addObj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>\nendobj");
    addObj(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}endstream\nendobj`);

    const startxref = Buffer.byteLength(pdf, "utf-8");
    pdf += "xref\n0 5\n0000000000 65535 f \n";
    for (let i = 0; i < offsets.length; i++) {
      const offStr = String(offsets[i]).padStart(10, "0");
      pdf += `${offStr} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

    return Buffer.from(pdf, "utf-8");
  }

  // Create test dummy buffers with valid magic bytes and parseable PDF structure
  const validPdfBytes = createMinimalValidPdf("GharPadharo Candidate Resume");
  const invalidBytes = Buffer.from("NOT_A_VALID_DOCUMENT_HEADER");

  // TEST 1: Missing file
  console.log("--- 1. Missing File Submission ---");
  try {
    const emptyForm = new FormData();
    const res1 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: emptyForm,
    });
    assert(res1.status === 400, `Missing file returns 400 Bad Request (got ${res1.status})`);
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // TEST 2: Unsupported file extension (.exe)
  console.log("\n--- 2. Unsupported File Extension ---");
  try {
    const form2 = new FormData();
    const fakeExe = new File([validPdfBytes], "resume.exe", { type: "application/pdf" });
    form2.append("file", fakeExe);
    const res2 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: form2,
    });
    assert(res2.status === 400, `Unsupported extension rejected with 400 (got ${res2.status})`);
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // TEST 3: Unsupported MIME type
  console.log("\n--- 3. Unsupported MIME Type ---");
  try {
    const form3 = new FormData();
    const fakeMime = new File([validPdfBytes], "resume.pdf", { type: "application/x-executable" });
    form3.append("file", fakeMime);
    const res3 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: form3,
    });
    assert(res3.status === 400, `Unsupported MIME type rejected with 400 (got ${res3.status})`);
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // TEST 4: Invalid magic bytes (spoofed file disguised as .pdf)
  console.log("\n--- 4. Invalid Magic Bytes (Spoofed File) ---");
  try {
    const form4 = new FormData();
    const spoofedFile = new File([invalidBytes], "corrupted.pdf", { type: "application/pdf" });
    form4.append("file", spoofedFile);
    const res4 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: form4,
    });
    assert(res4.status === 400, `Corrupted/spoofed bytes rejected with 400 (got ${res4.status})`);
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // TEST 5: File larger than 10MB
  console.log("\n--- 5. File Larger Than 10MB ---");
  try {
    const form5 = new FormData();
    // Create an oversized 11MB file with valid PDF magic prefix
    const oversizeBuffer = Buffer.alloc(11 * 1024 * 1024);
    oversizeBuffer.set(Buffer.from("%PDF-1.4"), 0);
    const largeFile = new File([oversizeBuffer], "large-resume.pdf", { type: "application/pdf" });
    form5.append("file", largeFile);
    const res5 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: form5,
    });
    assert(res5.status === 400, `File larger than 10MB rejected with 400 (got ${res5.status})`);
  } catch (err) {
    assert(false, `Test 5 threw error: ${err.message}`);
  }

  // TEST 6: Cloudinary Live Integration or Graceful Missing Credentials
  console.log("\n--- 6. Cloudinary Upload Integration ---");
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (isCloudinaryConfigured) {
    try {
      const form6 = new FormData();
      const validFile = new File([validPdfBytes], "candidate_sample_resume.pdf", { type: "application/pdf" });
      form6.append("file", validFile);
      const res6 = await fetch(`${BASE_URL}/api/uploads/resume`, {
        method: "POST",
        body: form6,
      });
      const data6 = await res6.json();

      assert(res6.status === 201, `Upload succeeded with 201 Created (got ${res6.status})`);
      assert(data6.success === true, "Response has success: true");
      assert(Boolean(data6.resume?.fileUrl), "Returned resume metadata has fileUrl");
      assert(Boolean(data6.resume?.publicId), "Returned resume metadata has publicId");
      assert(data6.resume?.fileName === "candidate_sample_resume.pdf", "Original fileName preserved");
      assert(
        data6.resume?.publicId.startsWith("gharpadharo-careers/resumes/"),
        "PublicId uses gharpadharo-careers/resumes folder"
      );

      // Verify no secrets appear in the response payload
      assert(!("api_secret" in data6), "No Cloudinary api_secret exposed in response");
      assert(!("api_key" in data6), "No Cloudinary api_key exposed in response");

      // Clean up uploaded test file
      const { deleteResume } = await import("../lib/cloudinary.js");
      const cleanupResult = await deleteResume(data6.resume.publicId);
      console.log(`🧹 Cleaned up live test resume from Cloudinary (publicId: ${data6.resume.publicId})`);
      assert(cleanupResult.success === true, "Uploaded test file cleaned up from Cloudinary");
    } catch (err) {
      assert(false, `Cloudinary upload integration threw error: ${err.message}`);
    }
  } else {
    skip(
      "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not defined in .env.local."
    );
    skip("Live Cloudinary remote upload skipped as expected in unconfigured development environment.");

    // Verify endpoint returns clean 500 when called without credentials
    const form6 = new FormData();
    const validFile = new File([validPdfBytes], "test_resume.pdf", { type: "application/pdf" });
    form6.append("file", validFile);
    const res6 = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      body: form6,
    });
    assert(
      res6.status === 500,
      `Unconfigured environment safely returns 500 service unavailable without crashing (got ${res6.status})`
    );
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED | ${skipped} SKIPPED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
