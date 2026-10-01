import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import mongoose from "mongoose";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function runNewsletterTests() {
  console.log("==================================================");
  console.log("NEWSLETTER SUBSCRIPTION FOCUSED VERIFICATION SUITE");
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

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";

  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  }

  const testEmails = [
    `test.newsletter.${Date.now()}@example.com`,
    `test.newsletter.duplicate.${Date.now()}@example.com`,
  ];

  try {
    // ----------------------------------------------------
    // 1. EMPTY / MISSING EMAIL VALIDATION
    // ----------------------------------------------------
    console.log("--- 1. Empty / Missing Email Validation ---");

    const emptyRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "" }),
    });
    assert(emptyRes.status === 400, "Empty email returns HTTP 400");
    const emptyJson = await emptyRes.json();
    assert(
      emptyJson.error === "Please enter a valid email address.",
      `Empty email returned friendly error message: '${emptyJson.error}'`
    );

    const missingRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert(missingRes.status === 400, "Missing email field returns HTTP 400");

    // ----------------------------------------------------
    // 2. INVALID EMAIL FORMAT VALIDATION
    // ----------------------------------------------------
    console.log("\n--- 2. Invalid Email Format Validation ---");

    const invalidEmails = ["notanemail", "user@", "@domain.com", "user@domain", "user@.com"];
    for (const inv of invalidEmails) {
      const invRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inv }),
      });
      assert(invRes.status === 400, `Invalid email '${inv}' rejected with HTTP 400`);
    }

    // ----------------------------------------------------
    // 3. VALID EMAIL SUBSCRIPTION
    // ----------------------------------------------------
    console.log("\n--- 3. Valid Email Subscription ---");

    const validEmail = testEmails[0];
    const uppercaseWithWhitespace = `  ${validEmail.toUpperCase()}  `;

    const validRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uppercaseWithWhitespace }),
    });

    assert(validRes.status === 201, `Valid email returned HTTP 201 Created (got ${validRes.status})`);
    const validJson = await validRes.json();
    assert(validJson.success === true, "Response has success: true");
    assert(
      validJson.message === "You're subscribed! We'll keep you updated.",
      `Response has friendly success message: '${validJson.message}'`
    );

    // Verify stored safely in MongoDB
    const savedSubscriber = await NewsletterSubscriber.findOne({ email: validEmail.toLowerCase() });
    assert(Boolean(savedSubscriber), "Subscriber record saved in MongoDB");
    assert(
      savedSubscriber.email === validEmail.toLowerCase(),
      `Subscriber email normalized to lowercase and trimmed: '${savedSubscriber.email}'`
    );
    assert(savedSubscriber.isActive === true, "Subscriber isActive defaults to true");
    assert(savedSubscriber.subscribedAt instanceof Date, "Subscriber subscribedAt timestamp is recorded");

    // ----------------------------------------------------
    // 4. DUPLICATE EMAIL SUBSCRIPTION HANDLING
    // ----------------------------------------------------
    console.log("\n--- 4. Duplicate Email Subscription Handling ---");

    const dupRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validEmail }),
    });

    assert(
      dupRes.status === 200 || dupRes.status === 409,
      `Duplicate email handled gracefully (got HTTP ${dupRes.status})`
    );
    const dupJson = await dupRes.json();
    assert(dupJson.isDuplicate === true, "Duplicate response indicates isDuplicate: true");
    assert(
      dupJson.message === "You're already subscribed.",
      `Duplicate response has friendly message: '${dupJson.message}'`
    );

    // Verify no second record was created
    const count = await NewsletterSubscriber.countDocuments({ email: validEmail.toLowerCase() });
    assert(count === 1, `Exact 1 record exists in MongoDB (no duplicate created, got count=${count})`);

  } finally {
    // Clean up test subscribers
    console.log("\n--- Cleanup Test Subscribers ---");
    const deleteRes = await NewsletterSubscriber.deleteMany({
      email: { $in: testEmails.map((e) => e.toLowerCase()) },
    });
    console.log(`Cleaned up ${deleteRes.deletedCount} test subscribers from MongoDB.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }

  console.log("\n==================================================");
  console.log(`NEWSLETTER TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runNewsletterTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
