import fs from "fs";
import path from "path";
import { encode } from "next-auth/jwt";
import mongoose from "mongoose";

// Load environment variables from .env.local
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
} catch (e) {
  // Ignore
}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "build-time-secret-placeholder-at-least-32-chars-long";

async function runTests() {
  console.log("==================================================");
  console.log("ADMIN SIDEBAR APPLICATIONS COUNT VERIFICATION");
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

  // 1. Static inspection: Ensure no hardcoded "10" badge in AdminSidebar.js
  const sidebarCode = fs.readFileSync(
    path.resolve(process.cwd(), "components/admin/AdminSidebar.js"),
    "utf-8"
  );
  assert(
    !sidebarCode.includes('badge: "10"') && !sidebarCode.includes("badge: '10'"),
    "AdminSidebar does not contain hardcoded badge: '10'"
  );
  assert(
    sidebarCode.includes('badge: typeof count === "number" ? String(count) : undefined'),
    "AdminSidebar derives badge dynamically from count state"
  );
  assert(
    sidebarCode.includes('"applications-updated"'),
    "AdminSidebar listens to 'applications-updated' custom event for real-time synchronization"
  );
  assert(
    sidebarCode.includes("/api/admin/dashboard/stats"),
    "AdminSidebar queries /api/admin/dashboard/stats for live application count"
  );

  // 2. Static inspection: Layout & Shell
  const layoutCode = fs.readFileSync(
    path.resolve(process.cwd(), "app/admin/dashboard/layout.js"),
    "utf-8"
  );
  assert(
    layoutCode.includes("Application.countDocuments({})"),
    "AdminDashboardLayout queries Application.countDocuments({}) on server render"
  );

  const tableCode = fs.readFileSync(
    path.resolve(process.cwd(), "components/admin/AdminApplicationsTable.js"),
    "utf-8"
  );
  assert(
    tableCode.includes('"applications-updated"'),
    "AdminApplicationsTable dispatches 'applications-updated' event"
  );
  assert(
    tableCode.includes("detail: { count: applications.length }"),
    "AdminApplicationsTable dispatches unfiltered total applications.length (not filtered count)"
  );

  // 3. Connect to MongoDB Atlas
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gharpadharo_careers";
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set!");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("Connected to MongoDB Atlas successfully.\n");

  const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const dbAdmin = await UserModel.findOne({ role: { $in: ["admin", "superadmin"] }, isActive: true }).lean();

  if (!dbAdmin) {
    console.error("❌ No active admin user found in database!");
    await mongoose.disconnect();
    process.exit(1);
  }

  const cookieName = BASE_URL.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const adminToken = await encode({
    token: {
      name: dbAdmin.name || "Admin Tester",
      email: dbAdmin.email,
      sub: dbAdmin._id.toString(),
      isAdmin: true,
      role: dbAdmin.role || "admin",
      dbUserId: dbAdmin._id.toString(),
    },
    secret: AUTH_SECRET,
    salt: cookieName,
  });

  const authCookie = `${cookieName}=${adminToken}; authjs.session-token=${adminToken}`;

  const appsCollection = mongoose.connection.collection("applications");
  const jobsCollection = mongoose.connection.collection("jobs");

  // 4. Check initial count in MongoDB
  const initialDbCount = await appsCollection.countDocuments({});
  console.log(`Initial MongoDB Application count: ${initialDbCount}`);

  // 5. Fetch dashboard stats API
  const statsRes = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
    headers: { Cookie: authCookie },
  });
  const statsData = await statsRes.json();
  const apiCount = statsData?.data?.applications?.total ?? statsData?.applications?.total;

  assert(
    statsRes.status === 200,
    `/api/admin/dashboard/stats returns HTTP 200`
  );
  assert(
    apiCount === initialDbCount,
    `/api/admin/dashboard/stats applications.total (${apiCount}) equals MongoDB count (${initialDbCount})`
  );

  // 6. Test dynamic increase upon new application submission
  const sampleJob = await jobsCollection.findOne({ status: "active" });
  let createdAppId = null;

  if (sampleJob) {
    const insertResult = await appsCollection.insertOne({
      jobId: sampleJob.id || sampleJob._id.toString(),
      candidate: "Test Sidebar Sync Candidate",
      email: `sidebar-test-${Date.now()}@example.com`,
      phone: "+919876543210",
      experience: "2-5",
      currentCompany: "Sync QA Labs",
      noticePeriod: "15",
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    createdAppId = insertResult.insertedId;

    const newDbCount = await appsCollection.countDocuments({});
    assert(
      newDbCount === initialDbCount + 1,
      `MongoDB count increased to ${newDbCount} after inserting test application`
    );

    // Call stats API to verify live count reflects new count
    const statsResAfterAdd = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: { Cookie: authCookie },
    });
    const statsDataAfterAdd = await statsResAfterAdd.json();
    const apiCountAfterAdd =
      statsDataAfterAdd?.data?.applications?.total ?? statsDataAfterAdd?.applications?.total;

    assert(
      apiCountAfterAdd === newDbCount,
      `/api/admin/dashboard/stats reflects incremented count (${apiCountAfterAdd})`
    );
  }

  // 7. Test dynamic decrease upon application deletion
  if (createdAppId) {
    await appsCollection.deleteOne({ _id: createdAppId });

    const finalDbCount = await appsCollection.countDocuments({});
    assert(
      finalDbCount === initialDbCount,
      `MongoDB count decreased back to original count (${finalDbCount}) after deleting test application`
    );

    const statsResAfterDel = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: { Cookie: authCookie },
    });
    const statsDataAfterDel = await statsResAfterDel.json();
    const apiCountAfterDel =
      statsDataAfterDel?.data?.applications?.total ?? statsDataAfterDel?.applications?.total;

    assert(
      apiCountAfterDel === finalDbCount,
      `/api/admin/dashboard/stats reflects decremented count (${apiCountAfterDel})`
    );
  }

  // 8. Verify admin page SSR HTML contains the real count and not the old 10
  const dashboardHtmlRes = await fetch(`${BASE_URL}/admin/dashboard/applications`, {
    headers: { Cookie: authCookie },
  });
  const html = await dashboardHtmlRes.text();
  assert(
    dashboardHtmlRes.status === 200,
    `GET /admin/dashboard/applications returns HTTP 200`
  );
  assert(
    !html.includes('Applications 10') && !html.includes('badge: "10"'),
    `Rendered HTML does not contain stale 'Applications 10'`
  );
  assert(
    html.includes(String(initialDbCount)),
    `Rendered HTML contains the actual count (${initialDbCount})`
  );

  await mongoose.disconnect();

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
