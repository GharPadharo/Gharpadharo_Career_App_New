import { auth } from "@/auth";
import { getAdminUserByEmail } from "@/lib/authAdmin";

/**
 * Reusable server-side guard for protected admin operations and /api/admin/* routes.
 * 
 * Independently enforces server-side authentication and database-backed authorization:
 * - Returns 401 if no valid authenticated session is present.
 * - Returns 403 if the user is authenticated but not an active admin/superadmin in MongoDB.
 * 
 * @returns {Promise<{ authorized: true, session: object, user: object } | { authorized: false, status: 401 | 403, error: string, response: Response }>}
 */
export async function requireAdminAuth() {
  const session = await auth();

  // 1. Authentication check
  if (!session || !session.user || !session.user.email) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
      response: new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized: Please sign in to access this resource.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  // 2. Database-backed Authorization check via MongoDB User collection
  const adminUser = await getAdminUserByEmail(session.user.email);
  if (!adminUser) {
    return {
      authorized: false,
      status: 403,
      error: "Admin authorization required",
      response: new Response(
        JSON.stringify({
          success: false,
          error: "Forbidden: Your account does not have administrator privileges.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  return {
    authorized: true,
    session,
    user: {
      ...session.user,
      id: adminUser._id?.toString() || session.user.id,
      role: adminUser.role || "admin",
      name: adminUser.name || session.user.name,
      email: adminUser.email,
    },
  };
}

export default requireAdminAuth;
