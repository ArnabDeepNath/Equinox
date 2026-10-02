"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Menu, X, Shield, User as UserIcon, LogOut } from "lucide-react";
import { AppUser } from "@/lib/types";

interface NavProps {
  user: AppUser | null;
}

export function Nav({ user }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Dumbbell className="w-5 h-5 text-neutral-950" />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase">
              Equinox <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Sports</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block flex-1 mx-8">
            <div className="flex items-center space-x-8 justify-center">
              <Link href="/venues" className="text-sm font-medium text-gray-300 transition-colors hover:text-amber-400">
                Venues
              </Link>
              <Link href="/book" className="text-sm font-medium text-gray-300 transition-colors hover:text-amber-400">
                Book Slots
              </Link>
              <Link href="/community" className="text-sm font-medium text-gray-300 transition-colors hover:text-amber-400">
                Community
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-3.5 py-1.5 rounded-full">
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-gray-200">{user.name}</span>
                  {user.membershipStatus === "approved" && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Member
                    </span>
                  )}
                </div>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all border border-white/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/join"
                  className="rounded-full bg-white/5 hover:bg-white/10 px-5 py-2 text-sm font-medium text-white transition-all border border-white/10"
                >
                  Join as Member
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold px-5 py-2 text-sm transition-all shadow-md shadow-orange-500/20 hover:-translate-y-0.5"
                >
                  Already a Member
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg bg-white/5"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-neutral-950 px-4 py-6 space-y-4">
          <Link
            href="/venues"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-gray-300 hover:text-amber-400"
          >
            Venues
          </Link>
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-gray-300 hover:text-amber-400"
          >
            Book Slots
          </Link>
          <Link
            href="/community"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-gray-300 hover:text-amber-400"
          >
            Community
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-amber-400"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="text-sm text-gray-400">
                  Signed in as <span className="font-semibold text-white">{user.name}</span>
                </div>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/join"
                  onClick={() => setIsOpen(false)}
                  className="text-center rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Join as Member
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold px-4 py-2.5 text-sm"
                >
                  Already a Member
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
