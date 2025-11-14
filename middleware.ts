import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.JWT_COOKIE_NAME!)?.value
  const { pathname } = req.nextUrl


  // --- 1. Authenticated user on login page → redirect to dashboard ---
  if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // --- 2. Protected routes (/dashboard/**) ---
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next() // valid token → allow access
  }

  // --- 3. All other routes (landing page, etc.) ---
  return NextResponse.next()
}
