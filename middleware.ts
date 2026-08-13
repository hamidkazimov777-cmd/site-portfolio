import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/control/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isLoggedIn && !isLoginPage) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/control/login", req.nextUrl.origin));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/control", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/control/:path*", "/api/admin/:path*"],
};
