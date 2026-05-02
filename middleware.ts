import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";


export const config = {
  matcher: ["/dashboard/:path*", "/client-portal/:path*", "/login"],
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const IS_PROD = process.env.NODE_ENV === "production";

export async function middleware(req: NextRequest) {
  const cookieName = process.env.JWT_COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;
  const pathname = req.nextUrl.pathname;

  let userRole: string | null = null;

  const url = req.nextUrl.clone()
      url.protocol = "https:"
      url.host = "sierracommunication.net"
      url.port = ""

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userRole = payload.role as string;
    } catch {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete({
        name: cookieName,
        path: "/",
        ...(IS_PROD && { domain: ".sierracommunication.net" }),
      });
      return res;
    }
  }

  
  if (pathname === "/login") {
    if (userRole) {
      const redirectPath =
      userRole === "CLIENT" ? "/client-portal" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    
    return NextResponse.next();
  }
  
  if (!userRole) {
    url.pathname = "/login"

    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard") && userRole === "CLIENT") {
    return NextResponse.redirect(new URL("/client-portal", req.url));
  }

  return NextResponse.next();
}
