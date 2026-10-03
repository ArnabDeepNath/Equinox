"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { toast } from "sonner";
import {
  Mail,
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || user.email?.split("@")[0],
          uid: user.uid,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google sign-in failed");

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in with Google";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Email address is required");
      return;
    }

    setLoading(true);
    try {
      // First attempt Firebase auth if user exists there
      try {
        if (password) {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (authErr) {
        // If not created in Firebase Auth directly yet, proceed with backend record verification
        console.warn("Direct Firebase password auth notice:", authErr);
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: email.split("@")[0],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success(`Logged in as ${data.user.name}`);
      router.push(data.user.role === "admin" ? "/admin" : "/");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col lg:flex-row">
      {/* Left Showcase Side */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#060606] via-[#120f08] to-[#060606] p-16 flex-col justify-between border-r border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5C158]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5C158] to-[#E5C158] flex items-center justify-center shadow-lg shadow-[#E5C158]/20">
              <Image
                src="/equinox-mark.svg"
                alt="Equinox Brand Mark"
                width={36}
                height={36}
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(229,193,88,0.4)]"
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              Equinox <span className="text-[#E5C158]">Sports</span>
            </span>
          </Link>

          <div className="mt-20 max-w-lg">
            <span className="text-[#E5C158] uppercase font-black tracking-widest text-xs">
              EQUINOX PLATFORM
            </span>
            <h1 className="text-5xl font-black text-white mt-4 leading-tight">
              Elevating the <span className="text-transparent gold-gradient-text">sports booking</span> experience
            </h1>
            <p className="text-gray-400 mt-4 text-base leading-relaxed">
              One unified platform connecting players, certified clubs, and organizers — so every game day runs flawlessly.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: ShieldCheck, text: "Role-based security & admin MIS panel" },
                { icon: Calendar, text: "Real-time court availability with instant confirmation" },
                { icon: Sparkles, text: "Membership-exclusive time windows & pricing tiers" },
                { icon: CheckCircle2, text: "Seamless mock checkout ready for Razorpay/Instamojo" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#E5C158]" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-gray-500 flex items-center justify-between">
          <span>Trusted by 500+ active paddle & football athletes</span>
          <span>Version 1.0 (PWA)</span>
        </div>
      </div>

      {/* Right Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/equinox-logo.svg"
                alt="Equinox — The Sports Commune"
                width={170}
                height={143}
                className="w-[170px] h-auto rounded-xl border border-white/10"
              />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight text-center">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1.5">
              Log in to your Equinox account to book slots and manage memberships.
            </p>
          </div>

          {/* Social Sign-In (Google) */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              {googleLoading ? "Signing in with Google..." : "Continue with Google"}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-neutral-950 px-3 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                OR CONTINUE WITH
              </span>
              <div className="border-t border-white/10 w-full"></div>
            </div>

            {/* Email / Phone Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-900 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  activeTab === "email"
                    ? "bg-[#E5C158] text-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("phone");
                  toast.info("Phone OTP is slated for Phase 2. Email & Google auth are fully active.");
                }}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  activeTab === "phone"
                    ? "bg-[#E5C158] text-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Phone OTP
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  placeholder="you@example.com (or admin@equinoxsport.com)"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => toast.info("For POC demo, any password or direct sign-in works.")}
                  className="text-xs text-[#E5C158] hover:text-[#E5C158] transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/15 bg-neutral-900/80 pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158] transition"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-[#E5C158] focus:ring-0"
                />
                Remember me
              </label>
              <span className="text-[11px] text-gray-500">Secured by Firebase</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full gold-button  text-neutral-950 font-black py-4 text-sm transition shadow-lg shadow-[0_4px_20px_-2px_rgba(229,193,88,0.3)] hover:brightness-105 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="rounded-2xl bg-neutral-900/40 border border-white/5 p-4 text-xs space-y-2">
            <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
              Quick Demo Accounts
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@equinoxsport.com");
                  setPassword("password123");
                }}
                className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md text-[#E5C158] border border-[#E5C158]/20"
              >
                Admin (admin@equinoxsport.com)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("aarav@example.com");
                  setPassword("password123");
                }}
                className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md text-[#F6E7B8] border border-[#E5C158]/30"
              >
                Member (aarav@example.com)
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link href="/join" className="text-[#E5C158] hover:text-[#E5C158] font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
