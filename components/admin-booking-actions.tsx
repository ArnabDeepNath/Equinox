"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface Props {
  bookingId: string;
}

export function AdminBookingActions({ bookingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);

  async function handleDecision(decision: "approved" | "rejected") {
    let reason: string | undefined = undefined;
    if (decision === "rejected") {
      const promptRes = window.prompt("Reason for declining this booking (optional, will be emailed to user):");
      if (promptRes === null) return; // user cancelled prompt
      reason = promptRes.trim() || undefined;
    }

    setLoading(decision);
    try {
      const res = await fetch("/api/admin/booking/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, decision, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${decision} booking`);

      toast.success(
        decision === "approved"
          ? "Booking confirmed and approval email dispatched!"
          : "Booking rejected and notification sent."
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to process booking decision");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleDecision("approved")}
        className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#E5C158] hover:bg-[#F6E7B8] text-black font-bold px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" />
        {loading === "approved" ? "Approving..." : "Approve & Email"}
      </button>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleDecision("rejected")}
        className="inline-flex items-center gap-1.5 rounded-[8px] border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        {loading === "rejected" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}
