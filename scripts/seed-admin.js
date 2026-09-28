/**
 * Legacy Admin Seeding Script (Wrapper around add-admin.js)
 * 
 * Maintained for backward-compatible development setup.
 * For standard operations, prefer:
 *   npm run add:admin -- admin@example.com
 *   npm run remove:admin -- admin@example.com
 * 
 * Usage:
 *   ADMIN_SEED_EMAIL="user@example.com" node scripts/seed-admin.js
 *   node scripts/seed-admin.js "user@example.com"
 */

import { addAdmin } from "./add-admin.js";

const rawInput = process.env.ADMIN_SEED_EMAIL || process.argv[2] || "";

if (!rawInput) {
  console.error("❌ ERROR: Valid ADMIN_SEED_EMAIL environment variable or argument is required.");
  console.error("Usage: ADMIN_SEED_EMAIL=\"user@example.com\" node scripts/seed-admin.js");
  console.error("   or: node scripts/seed-admin.js \"user@example.com\"");
  console.error("   or: npm run add:admin -- \"user@example.com\"");
  process.exit(1);
}

addAdmin(rawInput)
  .then((result) => {
    process.exit(result.code);
  })
  .catch((err) => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  });
