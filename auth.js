import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config.js";
import { getAdminUserByEmail } from "@/lib/authAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }
      // Server-side admin authorization: verify against MongoDB User collection
      const adminUser = await getAdminUserByEmail(user.email);
      if (!adminUser) {
        // AccessDenied triggers NextAuth redirect to /admin/login?error=AccessDenied
        return false;
      }

      // Record successful login timestamp and update profile info if available
      try {
        adminUser.lastLoginAt = new Date();
        if (user.name && !adminUser.name) adminUser.name = user.name;
        if (user.image && !adminUser.image) adminUser.image = user.image;
        await adminUser.save();
      } catch (err) {
        console.error("Failed to update lastLoginAt on admin login:", err);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        token.email = normalizedEmail;
        const adminUser = await getAdminUserByEmail(normalizedEmail);
        if (adminUser) {
          token.isAdmin = true;
          token.role = adminUser.role || "admin";
          token.dbUserId = adminUser._id.toString();
        } else {
          token.isAdmin = false;
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.dbUserId || token.sub;
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
