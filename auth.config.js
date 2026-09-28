/**
 * Edge-compatible NextAuth v5 configuration.
 * Contains no Node.js runtime builtins or database/mongoose dependencies.
 * Used by middleware.js in the Edge runtime.
 */

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "build-time-secret-placeholder-at-least-32-chars-long",
  callbacks: {
    session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.dbUserId || token.sub;
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
};

export default authConfig;
