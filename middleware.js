import NextAuth from "next-auth";
import authConfig from "./auth.config.js";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isAuthenticated = Boolean(session?.user?.email);
  const isAuthorized = Boolean(session?.user?.isAdmin);

  // Protected Admin UI Routes: /admin/dashboard and all subroutes
  if (pathname.startsWith("/admin/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAuthorized) {
      const deniedUrl = new URL("/admin/login", req.url);
      deniedUrl.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(deniedUrl);
    }
  }

  // Protected Admin API Routes: /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin authorization required" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/:path*",
  ],
};
