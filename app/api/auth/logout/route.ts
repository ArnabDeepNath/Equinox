import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function GET(request: NextRequest) {
  // Support direct browser visit or fallback redirect
  const origin = request.nextUrl.origin || "https://equinox-three.vercel.app";
  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set(sessionCookieName, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
