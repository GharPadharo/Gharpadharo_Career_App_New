/**
 * Edge-compatible NextAuth v5 configuration.
 * Contains no Node.js runtime builtins or database/mongoose dependencies.
 * Used by middleware.js in the Edge runtime.
 */

const resolvedSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// Fail fast in production runtime if required secret is missing
if (!resolvedSecret && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  throw new Error(
    "[Security] Missing required authentication secret: AUTH_SECRET or NEXTAUTH_SECRET must be defined in production."
  );
}

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: resolvedSecret,
  callbacks: {
    session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.dbUserId || token.sub;
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.role = token.role || "user";
        if (token.picture) {
          session.user.image = token.picture;
          session.user.picture = token.picture;
        }
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
};

export default authConfig;
