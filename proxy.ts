import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(sessionCookieName)?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
