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
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
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
        if (user.name) adminUser.name = user.name;
        if (user.image) adminUser.image = user.image;
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
          if (!token.picture && adminUser.image) {
            token.picture = adminUser.image;
          }
        } else {
          token.isAdmin = false;
          token.role = "user";
        }
      }
      if (user?.image || user?.picture) {
        token.picture = user.image || user.picture;
      }
      if (user?.name) {
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
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
  session: {
    strategy: "jwt",
  },
  secret: authConfig.secret,
});
