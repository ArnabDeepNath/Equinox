"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/section-title";

export default function JoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, favoriteGames: [] }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Registration failed");
      }

      toast.success("Account created successfully");
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
        title="Join as Member"
        subtitle="Create your account using email (Google SSO can be wired from Firebase config)."
      />

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-[var(--muted-foreground)]">
              Full Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-[var(--muted-foreground)]">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}