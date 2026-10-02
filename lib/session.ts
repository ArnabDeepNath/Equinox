import { cookies } from "next/headers";
import { AppUser } from "@/lib/types";
import { users } from "@/lib/mock-data";

const SESSION_COOKIE_KEY = "equinox_user";

export async function getCurrentUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_KEY)?.value;

  if (!value) {
    return null;
  }

  const user = users.find((item) => item.id === value);
  return user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}

export const sessionCookieName = SESSION_COOKIE_KEY;