"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/section-title";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(mode: "email" | "google") {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Already a Member"
        subtitle="POC login supports Email and Google mode simulation (Firebase-backed path ready)."
      />

      <Card className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-[var(--muted-foreground)]">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Use demo email: admin@equinoxsport.com"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button disabled={loading || !email} onClick={() => signIn("email")}>
            {loading ? "Signing in..." : "Sign in with Email"}
          </Button>
          <Button
            variant="secondary"
            disabled={loading || !email}
            onClick={() => signIn("google")}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          Demo users: admin@equinoxsport.com, aarav@example.com, meera@example.com
        </p>
      </Card>
    </div>
  );
}