import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

const PROTECTED_PREFIXES = ["/admin", "/book", "/membership", "/community"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const session = request.cookies.get(sessionCookieName)?.value;

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  const response = NextResponse.next();

  // Prevent browser back-button caching for protected views & dynamic data
  if (isProtected) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/book/:path*",
    "/membership/:path*",
    "/community/:path*",
  ],
};
