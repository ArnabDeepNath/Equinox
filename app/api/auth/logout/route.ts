import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST(request: NextRequest) {
  // Use request.url to dynamically determine the current origin (e.g. vercel.app domain)
  const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "https://equinox-three.vercel.app";
  const response = NextResponse.redirect(new URL("/", origin));
  
  response.cookies.set(sessionCookieName, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
