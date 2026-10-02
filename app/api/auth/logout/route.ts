import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  response.cookies.set(sessionCookieName, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}