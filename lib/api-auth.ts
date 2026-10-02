import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sessionCookieName } from "@/lib/session";
import { AppUser } from "@/lib/types";

export function getUserFromRequest(request: NextRequest): AppUser | null {
  const sessionId = request.cookies.get(sessionCookieName)?.value;
  if (!sessionId) {
    return null;
  }

  return store.users.find((user) => user.id === sessionId) ?? null;
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}