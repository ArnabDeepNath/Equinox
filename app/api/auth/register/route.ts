import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { sessionCookieName } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  favoriteGames: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = store.users.find((item) => item.email === parsed.data.email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const user = {
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    name: parsed.data.name,
    email: parsed.data.email,
    role: "user" as const,
    membershipStatus: "none" as const,
    favoriteGames: parsed.data.favoriteGames,
    createdAt: new Date().toISOString(),
  };

  store.users.unshift(user);

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(sessionCookieName, user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}