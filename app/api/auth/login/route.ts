import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { loginSchema } from "@/lib/validators";
import { sessionCookieName } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = store.users.find((item) => item.email === parsed.data.email);

  if (!user) {
    return NextResponse.json({ error: "No account found for this email" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(sessionCookieName, user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}