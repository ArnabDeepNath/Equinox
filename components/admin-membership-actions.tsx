"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminMembershipActions({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);
  const router = useRouter();

  async function decide(decision: "approved" | "rejected") {
    setLoading(decision);

    try {
      const response = await fetch("/api/admin/membership/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to update membership");

      toast.success(`Membership ${decision}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        className="text-xs"
        disabled={Boolean(loading)}
        onClick={() => decide("approved")}
      >
        {loading === "approved" ? "Approving..." : "Approve"}
      </Button>
      <Button
        variant="danger"
        className="text-xs"
        disabled={Boolean(loading)}
        onClick={() => decide("rejected")}
      >
        {loading === "rejected" ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}