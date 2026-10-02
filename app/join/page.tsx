"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { toast } from "sonner";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Phone,
} from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("Paddle");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || user.email?.split("@")[0] || "Player",
          email: user.email,
          uid: user.uid,
          favoriteGames: [favoriteSport],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google sign-up failed");

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign up with Google";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in name and email");
      return;
    }

    setLoading(true);
    try {
      // Optional Firebase auth user creation
      if (password && password.length >= 6) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (authErr) {
          console.warn("Direct Firebase auth user creation notice:", authErr);
        }
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          favoriteGames: [favoriteSport],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Welcome to Equinox Sports!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col lg:flex-row">
      {/* Left Showcase Side */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-950 via-[#100d07] to-neutral-950 p-16 flex-col justify-between border-r border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-6 h-6 text-neutral-950" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              Equinox <span className="text-amber-400">Sports</span>
            </span>
          </Link>

          <div className="mt-20 max-w-lg">
            <span className="text-amber-400 uppercase font-black tracking-widest text-xs">
              MEMBER ONBOARDING
            </span>
            <h1 className="text-5xl font-black text-white mt-4 leading-tight">
              Join the elite circle of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">sports enthusiasts</span>
            </h1>
            <p className="text-gray-400 mt-4 text-base leading-relaxed">
              Register in under 60 seconds to lock exclusive booking windows, get verified membership pricing, and find players in the community.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: Sparkles, text: "Save up to 20% on peak paddle & turf slots" },
                { icon: Calendar, text: "Priority conditional booking windows for members" },
                { icon: ShieldCheck, text: "Direct WhatsApp and email confirmation on booking" },
                { icon: CheckCircle2, text: "Access to verified sports venues across Guwahati" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-gray-500 flex items-center justify-between">
          <span>Trusted across multi-sport facilities</span>
          <span>Fast, Offline-Ready PWA</span>
        </div>
      </div>

      {/* Right Register Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1.5">
              Start reserving courts and connecting with sports clubs today.
            </p>
          </div>

          {/* Social Sign-Up (Google) */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/30 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {googleLoading ? "Signing up with Google..." : "Sign up with Google"}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-neutral-950 px-3 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                OR REGISTER WITH EMAIL
              </span>
              <div className="border-t border-white/10 w-full"></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-10 pr-3 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Primary Sport
                </label>
                <select
                  value={favoriteSport}
                  onChange={(e) => setFavoriteSport(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900 px-3 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Paddle">Paddle</option>
                  <option value="Football">Football</option>
                  <option value="Table Tennis">Table Tennis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-black py-4 text-sm transition shadow-lg shadow-orange-500/25 hover:brightness-105 disabled:opacity-50 mt-2"
            >
              {loading ? "Creating your account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
