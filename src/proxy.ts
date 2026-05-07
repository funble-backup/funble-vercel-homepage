import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const envJwtSecret = process.env.JWT_SECRET;
const JWT_SECRET = envJwtSecret ? new TextEncoder().encode(envJwtSecret) : null;
const COOKIE_NAME = "funble_admin_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!JWT_SECRET) {
    return pathname.startsWith("/api/admin")
      ? NextResponse.json(
          { error: "Server misconfigured" },
          { status: 500 }
        )
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Only protect /admin/* routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Also protect /api/admin/* routes except login
  if (
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login"
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
