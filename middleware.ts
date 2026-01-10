import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/dashboard/:path*", "/client-portal/:path*", "/login"],
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const cookieName = process.env.JWT_COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;
  const pathname = req.nextUrl.pathname;

  const url = req.nextUrl.clone();

  if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
    url.protocol = "https:";
    url.host = "sierracommunication.net";
    url.port = "";
  }

  let userRole: string | null = null;

  /* ================= JWT VERIFY ================= */

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userRole = payload.role as string;
    } catch {
      // JWT is invalid or expired → redirect to login and delete cookie
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete({ name: cookieName, path: "/" });
      return res;
    }
  }

  /* ================= AUTH GUARD ================= */

  // Not logged in → protected routes
  if (!userRole && (pathname.startsWith("/dashboard") || pathname.startsWith("/client-portal"))) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    return res;
  }

  /* ================= LOGIN PAGE ================= */

  if (pathname === "/login" && userRole) {
    // Already logged in → redirect based on role
    url.pathname = userRole === "CLIENT" ? "/client-portal" : "/dashboard";
    return NextResponse.redirect(url);
  }

  /* ================= ROLE PROTECTION ================= */

  if (pathname.startsWith("/dashboard") && userRole === "CLIENT") {
    url.pathname = "/client-portal";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
