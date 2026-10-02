import Link from "next/link";
import { AppUser } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NavProps {
  user: AppUser | null;
}

export function Nav({ user }: NavProps) {
  return (
    <header className="border-b border-[var(--border)] bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-wide text-[var(--gold-soft)]">
          EQUINOX SPORTS
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-[var(--muted-foreground)] md:flex">
          <Link href="/venues" className="hover:text-[var(--foreground)]">
            Venues
          </Link>
          <Link href="/book" className="hover:text-[var(--foreground)]">
            Book Slots
          </Link>
          <Link href="/community" className="hover:text-[var(--foreground)]">
            Community
          </Link>
          {user?.role === "admin" ? (
            <Link href="/admin" className="hover:text-[var(--foreground)]">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-xs text-[var(--muted-foreground)] sm:inline">
                {user.name}
              </span>
              <form action="/api/auth/logout" method="post">
                <Button variant="secondary" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/join">
                <Button variant="secondary">Join as Member</Button>
              </Link>
              <Link href="/login">
                <Button>Already a Member</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}