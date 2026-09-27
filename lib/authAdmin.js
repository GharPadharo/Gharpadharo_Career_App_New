/**
 * Admin Email Authorization Helper
 * 
 * Compares an authenticated user's email against the ADMIN_EMAILS environment variable.
 * Normalizes input (trim and lowercase) before comparison.
 * 
 * @param {string} email
 * @returns {boolean} true if email is authorized as an administrator
 */
export function isAuthorizedAdmin(email) {
  if (!email || typeof email !== "string") {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const rawAdminEmails = process.env.ADMIN_EMAILS || "";

  const authorizedEmails = rawAdminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return authorizedEmails.includes(normalizedEmail);
}
