import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";
import { AppUser } from "@/lib/types";
import { getUserById, getUserByEmail } from "@/lib/store";

export async function getUserFromRequest(request: NextRequest): Promise<AppUser | null> {
  const sessionId = request.cookies.get(sessionCookieName)?.value;
  if (!sessionId) {
    return null;
  }

  let user = await getUserById(sessionId);
  if (!user && sessionId.includes("@")) {
    user = await getUserByEmail(sessionId);
  }

  return user;
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
