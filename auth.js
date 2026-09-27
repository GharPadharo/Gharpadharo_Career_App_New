import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAuthorizedAdmin } from "@/lib/authAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }
      // Server-side admin authorization: only normalized emails in ADMIN_EMAILS are permitted
      const authorized = isAuthorizedAdmin(user.email);
      if (!authorized) {
        // AccessDenied triggers NextAuth redirect to /admin/login?error=AccessDenied
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email.toLowerCase();
        token.isAdmin = isAuthorizedAdmin(user.email);
        token.role = token.isAdmin ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "build-time-secret-placeholder-at-least-32-chars-long",
});
