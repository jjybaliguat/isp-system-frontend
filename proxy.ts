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
  const pathname = req.nextUrl.pathname

  const url = req.nextUrl.clone()

  if (process.env.NODE_ENV === "production") {
    url.protocol = "https:"
    url.host = "sierracommunication.net"
    url.port = ""            // 🔑 THIS removes :3000
  }

  // Logged-in user hitting login → dashboard
  if (token && pathname === "/login") {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") && !token) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
