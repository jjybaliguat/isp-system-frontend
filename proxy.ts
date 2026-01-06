import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get(process.env.JWT_COOKIE_NAME!)?.value
  const { pathname } = req.nextUrl

  // Logged-in user hitting login → dashboard
  if (token && pathname === "/login") {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // --- 3. All other routes (landing page, etc.) ---
  return NextResponse.next()
}
