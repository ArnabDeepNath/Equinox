"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MembershipPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/membership/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to submit request");
      }

      toast.success("Membership request submitted");
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Membership Request"
        subtitle="Ask admin for premium membership to unlock member-only slots and discounts."
      />

      <Card>
        <form className="space-y-4" onSubmit={submitRequest}>
          <div>
            <label htmlFor="reason" className="mb-1 block text-sm text-[var(--muted-foreground)]">
              Why do you want membership?
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Tell us your usage frequency, preferred slots, and sports goals..."
              minLength={10}
              maxLength={300}
              rows={5}
              required
            />
          </div>
          <Button disabled={loading} type="submit">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Card>
    </div>
  );
}