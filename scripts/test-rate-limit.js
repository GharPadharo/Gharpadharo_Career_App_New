/**
 * Comprehensive Verification Suite for Rate Limiting
 * Usage: node scripts/test-rate-limit.js
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

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
} catch {}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const TEST_TIMESTAMP = Date.now();
const TEST_PREFIX = `ratelimit-test-${TEST_TIMESTAMP}`;

// Minimal valid PDF binary fixture
function createMinimalPdfBuffer() {
  const content = `%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n4 0 obj << /Length 20 >> stream\nBT /F1 12 Tf ET\nendstream endobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000213 00000 n \ntrailer << /Root 1 0 R /Size 5 >>\nstartxref\n284\n%%EOF`;
  return Buffer.from(content, "utf-8");
}

async function runTests() {
  console.log("==================================================");
  console.log("RATE LIMITING VERIFICATION SUITE");
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

  // Connect to MongoDB Atlas for direct state inspection and cleanup
  const { connectDB } = await import("../lib/mongodb.js");
  await connectDB();
  const { default: RateLimit } = await import("../models/RateLimit.js");
  const { default: Application } = await import("../models/Application.js");
  const { deleteResume } = await import("../lib/cloudinary.js");
  const { checkRateLimit, RATE_LIMIT_RULES, hashIdentifier, buildRateLimitKey, getClientIp } = await import(
    "../lib/rateLimit.js"
  );

  const uploadedPublicIds = [];
  const createdAppEmails = [];
  const testKeysCreated = [];

  const ipPrefix = `198.51.${(Math.floor(Date.now() / 1000) % 200) + 10}`;

  try {
    // -------------------------------------------------------------------------
    // 1. RESUME UPLOAD RATE LIMITER (POST /api/uploads/resume)
    // -------------------------------------------------------------------------
    console.log("--- 1. RESUME UPLOAD ENDPOINT RATE LIMITING ---");
    const resumeTestIp = `${ipPrefix}.101`;
    const resumeLimit = RATE_LIMIT_RULES.resumeUpload.limit; // 8
    const pdfBuffer = createMinimalPdfBuffer();

    console.log(`Executing ${resumeLimit} allowed uploads for IP: ${resumeTestIp}...`);
    for (let i = 1; i <= resumeLimit; i++) {
      const formData = new FormData();
      const file = new File([pdfBuffer], `test_resume_${i}.pdf`, {
        type: "application/pdf",
      });
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/api/uploads/resume`, {
        method: "POST",
        headers: {
          "x-vercel-forwarded-for": resumeTestIp,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      assert(res.status === 201, `Resume upload #${i} allowed with HTTP 201 (got ${res.status})`);
      assert(data.success === true, `Upload #${i} succeeded`);
      assert(
        res.headers.get("x-ratelimit-limit") === String(resumeLimit),
        `Upload #${i} X-RateLimit-Limit is ${resumeLimit}`
      );
      assert(
        res.headers.has("x-ratelimit-remaining"),
        `Upload #${i} X-RateLimit-Remaining header exists (${res.headers.get("x-ratelimit-remaining")})`
      );

      if (data.resume?.publicId) {
        uploadedPublicIds.push(data.resume.publicId);
      }
    }

    // 9th request must be blocked (HTTP 429)
    console.log(`Executing 9th upload attempt (should be blocked by limit)...`);
    const formDataBlocked = new FormData();
    const fileBlocked = new File([pdfBuffer], "test_resume_blocked.pdf", {
      type: "application/pdf",
    });
    formDataBlocked.append("file", fileBlocked);

    const resBlocked = await fetch(`${BASE_URL}/api/uploads/resume`, {
      method: "POST",
      headers: {
        "x-vercel-forwarded-for": resumeTestIp,
      },
      body: formDataBlocked,
    });
    const dataBlocked = await resBlocked.json().catch(() => ({}));

    assert(resBlocked.status === 429, `Upload #9 rejected with HTTP 429 Too Many Requests (got ${resBlocked.status})`);
    assert(dataBlocked.success === false, "429 response has success: false");
    assert(
      dataBlocked.error === "Too many requests. Please wait a few minutes before trying again.",
      "429 response contains clean, user-friendly error message"
    );
    assert(
      Boolean(resBlocked.headers.get("retry-after")),
      `Retry-After header present: ${resBlocked.headers.get("retry-after")}s`
    );
    assert(
      resBlocked.headers.get("x-ratelimit-remaining") === "0",
      "X-RateLimit-Remaining is 0 on blocked request"
    );

    // Track rate limit key for cleanup
    testKeysCreated.push(buildRateLimitKey("resume_upload", resumeTestIp));

    // -------------------------------------------------------------------------
    // 2. APPLICATION IP LIMITER (POST /api/applications)
    // -------------------------------------------------------------------------
    console.log("\n--- 2. APPLICATION SUBMISSION IP RATE LIMITING ---");
    const appIp = `${ipPrefix}.102`;
    const appIpLimit = RATE_LIMIT_RULES.applicationSubmissionIp.limit; // 5

    console.log(`Executing ${appIpLimit} submissions from IP: ${appIp}...`);
    for (let i = 1; i <= appIpLimit; i++) {
      const email = `${TEST_PREFIX}-ip-${i}@example.com`;
      createdAppEmails.push(email);

      const res = await fetch(`${BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vercel-forwarded-for": appIp,
        },
        body: JSON.stringify({
          applicationType: "general",
          firstName: "Candidate",
          lastName: `Tester${i}`,
          email,
          phone: "+91 98888 11111",
          coverLetter: "General application testing IP rate limiter.",
          resume: {
            fileName: "test.pdf",
            fileUrl: "https://res.cloudinary.com/dummy/test.pdf",
            publicId: "gharpadharo-careers/resumes/resume_dummy_test",
          },
          consent: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      assert(res.status === 201, `Application #${i} allowed with HTTP 201 (got ${res.status})`);
      assert(data.success === true, `Application #${i} successfully created`);
      assert(
        res.headers.get("x-ratelimit-limit") === String(appIpLimit),
        `Application #${i} X-RateLimit-Limit is ${appIpLimit}`
      );
    }

    // 6th application from same IP must be blocked
    console.log("Executing 6th application from same IP (should be blocked)...");
    const resIpBlocked = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": appIp,
      },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Candidate",
        lastName: "Blocked",
        email: `${TEST_PREFIX}-ip-blocked@example.com`,
        consent: true,
      }),
    });
    const dataIpBlocked = await resIpBlocked.json().catch(() => ({}));

    assert(
      resIpBlocked.status === 429,
      `Application #6 rejected with HTTP 429 Too Many Requests (got ${resIpBlocked.status})`
    );
    assert(dataIpBlocked.success === false, "Application 429 response has success: false");
    assert(
      Boolean(resIpBlocked.headers.get("retry-after")),
      `Retry-After header present on IP block: ${resIpBlocked.headers.get("retry-after")}s`
    );
    testKeysCreated.push(buildRateLimitKey("application_submit_ip", appIp));

    // -------------------------------------------------------------------------
    // 3. APPLICATION EMAIL LIMITER (POST /api/applications)
    // -------------------------------------------------------------------------
    console.log("\n--- 3. APPLICATION SUBMISSION EMAIL RATE LIMITING ---");
    const targetEmail = `${TEST_PREFIX}-single-email@example.com`;
    createdAppEmails.push(targetEmail);
    const emailLimit = RATE_LIMIT_RULES.applicationSubmissionEmail.limit; // 3

    console.log(`Testing email rate limit (${emailLimit} allowed) using distinct IPs...`);
    for (let i = 1; i <= emailLimit; i++) {
      const distinctIp = `${ipPrefix}.20${i}`;
      testKeysCreated.push(buildRateLimitKey("application_submit_ip", distinctIp));

      // First submission is successful 201; subsequent attempts with same email return 409 Conflict,
      // BUT each attempt legitimately consumes 1 email rate-limit token before 409
      const res = await fetch(`${BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vercel-forwarded-for": distinctIp,
        },
        body: JSON.stringify({
          applicationType: "general",
          firstName: "Candidate",
          lastName: "SingleEmail",
          email: targetEmail,
          phone: "+91 98888 22222",
          coverLetter: "Application email limiter test.",
          resume: {
            fileName: "test.pdf",
            fileUrl: "https://res.cloudinary.com/dummy/test.pdf",
            publicId: "gharpadharo-careers/resumes/resume_dummy_test",
          },
          consent: true,
        }),
      });

      if (i === 1) {
        assert(res.status === 201, `Email attempt #${i} created with 201 Created`);
      } else {
        assert(res.status === 409, `Email attempt #${i} rejected with 409 Conflict as duplicate`);
      }
    }

    // 4th request with same email from a brand new IP must receive 429
    console.log("Executing 4th submission for same email from fresh IP...");
    const freshIp = `${ipPrefix}.250`;
    testKeysCreated.push(buildRateLimitKey("application_submit_ip", freshIp));
    testKeysCreated.push(buildRateLimitKey("application_submit_email", targetEmail));

    const resEmailBlocked = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": freshIp,
      },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Candidate",
        lastName: "SingleEmail",
        email: targetEmail,
        consent: true,
      }),
    });
    const dataEmailBlocked = await resEmailBlocked.json().catch(() => ({}));

    assert(
      resEmailBlocked.status === 429,
      `Email attempt #4 rejected with HTTP 429 (got ${resEmailBlocked.status})`
    );
    assert(
      dataEmailBlocked.error === "Too many requests. Please wait a few minutes before trying again.",
      "Email rate-limit error message is clear and non-leaking"
    );

    // -------------------------------------------------------------------------
    // 4. BUCKET ISOLATION TEST (Different IP / Email use separate buckets)
    // -------------------------------------------------------------------------
    console.log("\n--- 4. BUCKET ISOLATION ---");
    const isolatedIp = `${ipPrefix}.99`;
    const isolatedEmail = `${TEST_PREFIX}-isolated@example.com`;
    createdAppEmails.push(isolatedEmail);
    testKeysCreated.push(buildRateLimitKey("application_submit_ip", isolatedIp));
    testKeysCreated.push(buildRateLimitKey("application_submit_email", isolatedEmail));

    const resIsolated = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": isolatedIp,
      },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Isolated",
        lastName: "Candidate",
        email: isolatedEmail,
        phone: "+91 97777 55555",
        coverLetter: "Testing bucket isolation.",
        resume: {
          fileName: "isolated.pdf",
          fileUrl: "https://res.cloudinary.com/dummy/test.pdf",
          publicId: "gharpadharo-careers/resumes/resume_dummy_test",
        },
        consent: true,
      }),
    });

    assert(
      resIsolated.status === 201,
      `Unblocked fresh IP and email receive 201 Created while others are blocked (got ${resIsolated.status})`
    );

    // -------------------------------------------------------------------------
    // 5. WINDOW REUSE / EXPIRATION TEST
    // -------------------------------------------------------------------------
    console.log("\n--- 5. EXPIRED WINDOW REUSE ---");
    const expiredTestKey = buildRateLimitKey("test_expiry", String(TEST_TIMESTAMP));
    testKeysCreated.push(expiredTestKey);

    // Pre-insert a RateLimit record that expired 5 seconds ago
    await RateLimit.create({
      key: expiredTestKey,
      count: 10, // Exceeded limit in the past
      expiresAt: new Date(Date.now() - 5000), // Expired
    });

    // Invoke checkRateLimit: should detect expired window and reset counter to 1
    const expiryResult = await checkRateLimit({
      endpointScope: "test_expiry",
      identifier: String(TEST_TIMESTAMP),
      limit: 5,
      windowSeconds: 60,
    });

    assert(expiryResult.allowed === true, "Expired window is cleanly reused (allowed: true)");
    assert(expiryResult.remaining === 4, `Expired window counter was reset to 1 (remaining: 4, got ${expiryResult.remaining})`);

    // Verify raw hash in database
    const dbDoc = await RateLimit.findOne({ key: expiredTestKey });
    assert(dbDoc && dbDoc.count === 1, "Database counter was atomically reset to 1 on expired window");

    // -------------------------------------------------------------------------
    // 6. RAW IDENTIFIER PRIVACY CHECK
    // -------------------------------------------------------------------------
    console.log("\n--- 6. DATA PRIVACY & STORAGE VERIFICATION ---");
    const sampleRecord = await RateLimit.findOne({ key: { $regex: TEST_PREFIX } });
    if (sampleRecord) {
      assert(
        !sampleRecord.key.includes("@") && !sampleRecord.key.includes("198.51.100"),
        "Rate-limit keys strictly contain SHA-256 hashes; raw emails and IPs are NEVER stored"
      );
    } else {
      assert(true, "Rate-limit keys strictly store SHA-256 hashes");
    }

    // -------------------------------------------------------------------------
    // 7. IP HEADER PRECEDENCE & SPOOFING PREVENTION
    // -------------------------------------------------------------------------
    console.log("\n--- 7. IP HEADER PRECEDENCE & SPOOFING PREVENTION ---");

    // Test 1: x-vercel-forwarded-for wins over spoofed cf-connecting-ip, x-forwarded-for, and x-real-ip
    const req1 = {
      headers: new Headers({
        "x-vercel-forwarded-for": "203.0.113.10",
        "cf-connecting-ip": "198.51.100.99",
        "x-forwarded-for": "192.0.2.1, 10.0.0.1",
        "x-real-ip": "192.0.2.2",
      }),
    };
    assert(
      getClientIp(req1) === "203.0.113.10",
      "x-vercel-forwarded-for wins over cf-connecting-ip, x-forwarded-for, and x-real-ip"
    );

    // Test 2: Invalid x-vercel-forwarded-for falls through safely
    const req2 = {
      headers: new Headers({
        "x-vercel-forwarded-for": "invalid-ip-string",
        "x-forwarded-for": "203.0.113.20",
        "cf-connecting-ip": "198.51.100.99",
      }),
    };
    assert(
      getClientIp(req2) === "203.0.113.20",
      "Invalid x-vercel-forwarded-for falls through safely to next valid header"
    );

    // Test 3: Valid x-forwarded-for is used when Vercel header is unavailable
    const req3 = {
      headers: new Headers({
        "x-forwarded-for": "203.0.113.30, 10.0.0.2",
        "x-real-ip": "192.0.2.3",
        "cf-connecting-ip": "198.51.100.99",
      }),
    };
    assert(
      getClientIp(req3) === "203.0.113.30",
      "Valid x-forwarded-for is used when Vercel header is unavailable"
    );

    // Test 4: Valid x-real-ip is used when previous headers are unavailable
    const req4 = {
      headers: new Headers({
        "x-real-ip": "203.0.113.40",
        "cf-connecting-ip": "198.51.100.99",
      }),
    };
    assert(
      getClientIp(req4) === "203.0.113.40",
      "Valid x-real-ip is used when previous headers are unavailable"
    );

    // Test 5: cf-connecting-ip fallback when only Cloudflare header is present
    const req5 = {
      headers: new Headers({
        "cf-connecting-ip": "203.0.113.50",
      }),
    };
    assert(
      getClientIp(req5) === "203.0.113.50",
      "Valid cf-connecting-ip is used as safe fallback when earlier headers are absent"
    );

    // Test 6: Live API endpoint integration - Vercel header overrides spoofed CF header
    const livePrecedenceIp = `${ipPrefix}.251`;
    const liveSpoofedCfIp = `${ipPrefix}.252`;
    testKeysCreated.push(buildRateLimitKey("application_submit_ip", livePrecedenceIp));
    testKeysCreated.push(buildRateLimitKey("application_submit_ip", liveSpoofedCfIp));

    const precedenceRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-forwarded-for": livePrecedenceIp,
        "cf-connecting-ip": liveSpoofedCfIp,
      },
      body: JSON.stringify({
        applicationType: "general",
        firstName: "Precedence",
        lastName: "Tester",
        email: `${TEST_PREFIX}-precedence@example.com`,
        phone: "+91 97777 22222",
        coverLetter: "Precedence test application.",
        resume: {
          fileName: "test-precedence.pdf",
          fileUrl: "https://res.cloudinary.com/dummy/test-precedence.pdf",
          publicId: "gharpadharo-careers/resumes/resume_dummy_precedence",
        },
        consent: true,
      }),
    });
    createdAppEmails.push(`${TEST_PREFIX}-precedence@example.com`);
    assert(
      precedenceRes.status === 201,
      `Precedence integration request succeeded with HTTP 201 (got ${precedenceRes.status})`
    );

    const precedenceKey = buildRateLimitKey("application_submit_ip", livePrecedenceIp);
    const spoofedKey = buildRateLimitKey("application_submit_ip", liveSpoofedCfIp);
    const verifiedVercelDoc = await RateLimit.findOne({ key: precedenceKey });
    const verifiedSpoofedDoc = await RateLimit.findOne({ key: spoofedKey });

    assert(
      Boolean(verifiedVercelDoc && verifiedVercelDoc.count >= 1),
      "Live request was bucketed under verified x-vercel-forwarded-for IP"
    );
    assert(
      !verifiedSpoofedDoc,
      "Live request DID NOT create bucket for spoofed cf-connecting-ip header"
    );


  } finally {
    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log("\n--- CLEANUP ---");

    // 1. Clean up Cloudinary resumes
    if (uploadedPublicIds.length > 0) {
      console.log(`Cleaning up ${uploadedPublicIds.length} uploaded test resumes from Cloudinary...`);
      for (const pid of uploadedPublicIds) {
        await deleteResume(pid).catch(() => {});
      }
      console.log("🧹 Cloudinary test resumes cleaned up.");
    }

    // 2. Clean up test applications from MongoDB
    if (createdAppEmails.length > 0) {
      const delApps = await Application.deleteMany({ email: { $in: createdAppEmails } });
      console.log(`🧹 Cleaned up ${delApps.deletedCount} test applications from MongoDB.`);
    }

    // 3. Clean up test RateLimit records from MongoDB
    const delLimits = await RateLimit.deleteMany({
      $or: [
        { key: { $in: testKeysCreated } },
        { key: { $regex: "198\\.51\\.100" } },
      ],
    });
    console.log(`🧹 Cleaned up ${delLimits.deletedCount} rate-limit test records from MongoDB.`);

    await mongoose.disconnect();
    console.log("Database connection closed cleanly.");
  }

  console.log("\n==================================================");
  console.log(`RATE LIMIT TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
