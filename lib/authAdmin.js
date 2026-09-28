import { connectDB } from "./mongodb.js";
import User from "../models/User.js";

/**
 * Server-Side Admin Authorization Helper
 * 
 * Verifies whether an authenticated Google account belongs to an authorized, active
 * administrator using the MongoDB User collection as the single source of truth.
 * 
 * Authorization Rules:
 * 1. Email must be provided and normalized (trimmed, lowercase).
 * 2. User document must exist in MongoDB.
 * 3. User document must have isActive === true.
 * 4. User document must have role === "admin" or role === "superadmin".
 * 
 * @param {string} email - The candidate email address to verify
 * @returns {Promise<object|null>} The authorized User document or null if unauthorized
 */
export async function getAdminUserByEmail(email) {
  if (!email || typeof email !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return null;
    }

    if (user.isActive !== true) {
      return null;
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getAdminUserByEmail authorization lookup:", error);
    return null;
  }
}

/**
 * Boolean convenience helper for admin authorization checks.
 * 
 * @param {string} email
 * @returns {Promise<boolean>} true if authorized as an active admin or superadmin
 */
export async function isAuthorizedAdmin(email) {
  const adminUser = await getAdminUserByEmail(email);
  return Boolean(adminUser);
}
