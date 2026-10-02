import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { users } from "@/lib/mock-data";
import { sessionCookieName } from "@/lib/session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(sessionCookieName)?.value;
  const user = users.find((item) => item.id === session);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};