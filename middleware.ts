import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

function isLocalRequest(req: Request): boolean {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // The admin panel is local-only: on any deployed (non-localhost) host, the
  // control panel and its API simply don't exist. This keeps the admin — and
  // its Node/Prisma runtime — off the public Cloudflare deployment entirely.
  if (!isLocalRequest(req)) {
    return new NextResponse(null, { status: 404 });
  }

  const isLoggedIn = !!req.auth;
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
