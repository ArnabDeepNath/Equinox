import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail, upsertUser } from "@/lib/store";
import { sessionCookieName } from "@/lib/session";
import { AppUser } from "@/lib/types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  favoriteGames: z.array(z.string()).optional().default([]),
  uid: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const err = parsed.error.issues[0]?.message || "Invalid payload";
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const { email, name, favoriteGames, uid } = parsed.data;

    const existing = await getUserByEmail(email);
    if (existing) {
      // Log them in smoothly
      const response = NextResponse.json({ ok: true, user: existing, message: "Welcome back!" });
      response.cookies.set(sessionCookieName, existing.id, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }

    const isAdmin = email.toLowerCase() === "admin@equinoxsport.com";
    const newUser: AppUser = {
      id: uid || `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: isAdmin ? "admin" : "user",
      membershipStatus: isAdmin ? "approved" : "none",
      favoriteGames: favoriteGames.length ? favoriteGames : ["Paddle"],
      createdAt: new Date().toISOString(),
    };

    const user = await upsertUser(newUser);

    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(sessionCookieName, user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
