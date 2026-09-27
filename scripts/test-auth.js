/**
 * Phase 2B Authentication & Authorization Verification Suite
 * Usage: node scripts/test-auth.js
 */

const { isAuthorizedAdmin } = require("../lib/authAdmin");

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 2B: AUTHENTICATION & AUTHORIZATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Authorization Unit Tests (Email normalization and whitelist)
  console.log("\n--- 1. EMAIL AUTHORIZATION LOGIC ---");
  process.env.ADMIN_EMAILS = "himanshu@gharpadharo.com, admin@gharpadharo.com";

  assert(isAuthorizedAdmin("himanshu@gharpadharo.com") === true, "Exact matching admin email returns true");
  assert(isAuthorizedAdmin("  HIMANSHU@gharpadharo.COM  ") === true, "Email with mixed case and leading/trailing whitespace returns true");
  assert(isAuthorizedAdmin("admin@gharpadharo.com") === true, "Second listed admin returns true");
  assert(isAuthorizedAdmin("unauthorized.person@gmail.com") === false, "Non-whitelisted Google account returns false");
  assert(isAuthorizedAdmin("") === false, "Empty string returns false");
  assert(isAuthorizedAdmin(null) === false, "Null email returns false");
  assert(isAuthorizedAdmin(undefined) === false, "Undefined email returns false");

  // 2. HTTP Route Protection Tests (via local dev server)
  console.log("\n--- 2. ROUTE PROTECTION & REDIRECTS (LOGGED OUT) ---");
  
  try {
    // 2.1 /admin/dashboard redirect
    const dashRes = await fetch("http://localhost:3000/admin/dashboard", { redirect: "manual" });
    const dashLoc = dashRes.headers.get("location") || "";
    assert(
      dashRes.status === 307 || dashRes.status === 308 || dashRes.status === 302 || dashLoc.includes("/admin/login"),
      `/admin/dashboard redirects unauthenticated visitor to login (Status: ${dashRes.status}, Location: ${dashLoc})`
    );

    // 2.2 /admin/dashboard/jobs redirect
    const jobsAdminRes = await fetch("http://localhost:3000/admin/dashboard/jobs", { redirect: "manual" });
    const jobsAdminLoc = jobsAdminRes.headers.get("location") || "";
    assert(
      jobsAdminRes.status === 307 || jobsAdminRes.status === 308 || jobsAdminRes.status === 302 || jobsAdminLoc.includes("/admin/login"),
      `/admin/dashboard/jobs redirects unauthenticated visitor to login (Status: ${jobsAdminRes.status})`
    );

    // 2.3 /admin/dashboard/applications redirect
    const appsAdminRes = await fetch("http://localhost:3000/admin/dashboard/applications", { redirect: "manual" });
    const appsAdminLoc = appsAdminRes.headers.get("location") || "";
    assert(
      appsAdminRes.status === 307 || appsAdminRes.status === 308 || appsAdminRes.status === 302 || appsAdminLoc.includes("/admin/login"),
      `/admin/dashboard/applications redirects unauthenticated visitor to login (Status: ${appsAdminRes.status})`
    );

    // 3. Public Routes Accessibility (Must remain 200 without auth)
    console.log("\n--- 3. PUBLIC ROUTES ACCESSIBILITY ---");
    const pubJobsRes = await fetch("http://localhost:3000/jobs");
    assert(pubJobsRes.status === 200, "Public /jobs is accessible without authentication (HTTP 200)");

    const pubJobDetailRes = await fetch("http://localhost:3000/jobs/ai-research-scientist");
    assert(pubJobDetailRes.status === 200, "Public /jobs/ai-research-scientist is accessible (HTTP 200)");

    const pubApplyRes = await fetch("http://localhost:3000/jobs/ai-research-scientist/apply");
    assert(pubApplyRes.status === 200, "Public /jobs/ai-research-scientist/apply is accessible (HTTP 200)");

    // 4. Login Page & AccessDenied Error State
    console.log("\n--- 4. LOGIN PAGE & ERROR HANDLING ---");
    const loginPageRes = await fetch("http://localhost:3000/admin/login");
    assert(loginPageRes.status === 200, "Admin login page is accessible (HTTP 200)");

    const accessDeniedRes = await fetch("http://localhost:3000/admin/login?error=AccessDenied");
    const accessDeniedHtml = await accessDeniedRes.text();
    assert(
      accessDeniedHtml.includes("Access denied") && accessDeniedHtml.includes("not authorized"),
      "Login page renders clear Access Denied alert message when error=AccessDenied"
    );

    // 5. NextAuth API Endpoints
    console.log("\n--- 5. NEXTAUTH API ENDPOINTS ---");
    const providersRes = await fetch("http://localhost:3000/api/auth/providers");
    const providersJson = await providersRes.json();
    assert(providersRes.status === 200 && providersJson.google, "Auth API provides Google provider registration");

    const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
    const csrfJson = await csrfRes.json();
    assert(csrfRes.status === 200 && csrfJson.csrfToken, "Auth API provides CSRF token generation");

  } catch (err) {
    console.error("HTTP test error (ensure dev server is running on port 3000):", err.message);
  }

  console.log("\n==================================================");
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
