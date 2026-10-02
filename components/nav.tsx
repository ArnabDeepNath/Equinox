"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Dumbbell, Menu, X, Shield, User as UserIcon, LogOut } from "lucide-react";
import { AppUser } from "@/lib/types";

interface NavProps {
  user: AppUser | null;
}

export function Nav({ user }: NavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn("Firebase signout notice:", err);
      }
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      // Clear cookie client-side as well to guarantee immediate drop
      document.cookie = "equinox_user=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Force reload to cleanly refresh server state without leaving current domain
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/";
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] border-b border-[#1A1A1A] bg-[#0B0B0B]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5B301] flex items-center justify-center font-black text-black">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Equinox <span className="text-[#F5B301]">Sports</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#A1A1A1]">
            <Link href="/venues" className="transition-colors hover:text-white">
              Venues
            </Link>
            <Link href="/#sports" className="transition-colors hover:text-white">
              Sports
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/community" className="transition-colors hover:text-white">
              Community
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-semibold text-[#F5B301] hover:underline"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#121212] border border-[#1E1E1E] px-3 py-1.5 rounded-lg text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-[#F5B301]" />
                  <span className="font-medium text-white">{user.name}</span>
                  {user.membershipStatus === "approved" && (
                    <span className="bg-[#F5B301]/20 text-[#F5B301] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      MEMBER
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#2A2A2A] bg-transparent hover:bg-[#1A1A1A] px-3.5 py-2 text-xs font-medium text-[#A1A1A1] hover:text-white transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-[10px] border border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/book"
                  className="rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-semibold px-4 py-2 text-sm transition-colors"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#A1A1A1] hover:text-white p-2 rounded-lg bg-[#141414]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#1A1A1A] bg-[#0B0B0B] px-4 py-6 space-y-4">
          <Link
            href="/venues"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[#A1A1A1] hover:text-white"
          >
            Venues
          </Link>
          <Link
            href="/#sports"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[#A1A1A1] hover:text-white"
          >
            Sports
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[#A1A1A1] hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/community"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[#A1A1A1] hover:text-white"
          >
            Community
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-[#F5B301]"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-[#1E1E1E]">
            {user ? (
              <div className="space-y-3">
                <div className="text-xs text-[#A1A1A1]">
                  Signed in as <span className="font-semibold text-white">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-[10px] bg-[#1A1A1A] py-2.5 text-xs font-medium text-white"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center rounded-[10px] border border-[#2A2A2A] py-2.5 text-xs font-medium text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="text-center rounded-[10px] bg-[#F5B301] text-black font-semibold py-2.5 text-xs"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
