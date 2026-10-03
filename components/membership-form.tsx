"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MembershipForm() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please explain your sports goals");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/membership/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      toast.success("Application submitted successfully!");
      setReason("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-white block mb-1.5">
          Tell us about your sport frequency & preferred slots
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          minLength={10}
          maxLength={300}
          rows={4}
          placeholder="I play paddle twice a week on weekday mornings in Guwahati and wish to reserve peak slots..."
          className="w-full rounded-[10px] border border-[#2A2A2A] bg-[#0E0E0E] p-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#E5C158]"
        />
        <span className="text-[10px] text-[#A1A1A1]">Minimum 10 characters</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[10px] bg-[#E5C158] hover:bg-[#D4AF37] text-black font-semibold py-3 text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting Application..." : "Submit Application"}
      </button>
    </form>
  );
}
