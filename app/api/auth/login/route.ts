import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail, upsertUser } from "@/lib/store";
import { sessionCookieName } from "@/lib/session";
import { AppUser } from "@/lib/types";

const loginSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  uid: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload: valid email is required" }, { status: 400 });
    }

    const { email, name, uid } = parsed.data;

    let user = await getUserByEmail(email);

    if (!user) {
      // First time user through OAuth or direct email
      const isAdmin = email.toLowerCase().includes("admin") || email === "arnabdeepnath@gmail.com";
      const newUser: AppUser = {
        id: uid || `user-${Date.now()}`,
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        role: isAdmin ? "admin" : "user",
        membershipStatus: isAdmin ? "approved" : "none",
        favoriteGames: ["Paddle", "Football"],
        createdAt: new Date().toISOString(),
      };
      user = await upsertUser(newUser);
    }

    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(sessionCookieName, user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Failed to process login" }, { status: 500 });
  }
}
