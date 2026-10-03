"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Lock,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AppUser, Court, Game, Slot, Venue } from "@/lib/types";

interface BookingFlowProps {
  user: AppUser;
  venues: Venue[];
  games: Game[];
  courts: Court[];
  slots: Slot[];
  initialVenueId?: string;
}

interface QuoteState {
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export function BookingFlow({
  user,
  venues,
  games,
  courts,
  slots,
  initialVenueId,
}: BookingFlowProps) {
  const router = useRouter();
  const [venueId, setVenueId] = useState(
    initialVenueId && venues.some((v) => v.id === initialVenueId)
      ? initialVenueId
      : venues[0]?.id ?? ""
  );
  const [gameId, setGameId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const availableGames = useMemo(
    () => games.filter((game) => game.venueIds.includes(venueId)),
    [games, venueId]
  );

  const availableCourts = useMemo(
    () => courts.filter((court) => court.venueId === venueId && (!gameId || court.gameId === gameId)),
    [courts, venueId, gameId]
  );

  const availableSlots = useMemo(
    () => slots.filter((slot) => slot.courtId === courtId),
    [slots, courtId]
  );

  const selectedVenue = venues.find((v) => v.id === venueId);
  const selectedCourt = courts.find((c) => c.id === courtId);
  const selectedSlot = slots.find((s) => s.id === slotId);

  async function getQuote() {
    if (!courtId || !slotId || !bookingDate) {
      toast.error("Please pick a court, a slot, and a date");
      return;
    }

    setLoadingQuote(true);

    try {
      const response = await fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courtId, slotId, bookingDate }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch quote");
      }

      setQuote(data.quote);
      toast.success("Price calculated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  }

  async function confirmBooking() {
    if (!quote) {
      toast.error("Please calculate price before payment");
      return;
    }

    setConfirming(true);
    try {
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          gameId: selectedCourt?.gameId || gameId,
          courtId,
          slotId,
          bookingDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Payment checkout failed");
      }

      toast.success("Booking confirmed!");
      router.push(`/book/confirmation?bookingId=${data.booking.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Selection Column (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Step 1: Venue */}
        <div className="rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
            1. Select Venue
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {venues.map((v) => {
              const active = v.id === venueId;
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => {
                    setVenueId(v.id);
                    setGameId("");
                    setCourtId("");
                    setSlotId("");
                    setQuote(null);
                  }}
                  className={`text-left p-4 rounded-[12px] border transition-colors ${
                    active
                      ? "border-[#E5C158] bg-[#181818]"
                      : "border-[#2A2A2A] bg-[#0E0E0E] hover:border-[#3A3A3A]"
                  }`}
                >
                  <p className="font-semibold text-white text-sm">{v.name}</p>
                  <p className="text-xs text-[#A1A1A1] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E5C158]" />
                    {v.city} · {v.currency}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Sport */}
        <div className="rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
            2. Choose Sport
          </label>
          <div className="flex flex-wrap gap-2">
            {availableGames.map((g) => {
              const active = g.id === gameId;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => {
                    setGameId(g.id);
                    setCourtId("");
                    setSlotId("");
                    setQuote(null);
                  }}
                  className={`px-4 py-2.5 rounded-[10px] border text-xs font-semibold transition-colors ${
                    active
                      ? "border-[#E5C158] bg-[#E5C158] text-black"
                      : "border-[#2A2A2A] bg-[#0E0E0E] text-[#A1A1A1] hover:text-white hover:border-[#3A3A3A]"
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Court & Date */}
        <div className="rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
            3. Court & Date
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A1A1A1] block mb-1.5 font-medium">Court</label>
              <select
                className="w-full rounded-[10px] border border-[#2A2A2A] bg-[#0E0E0E] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5C158]"
                value={courtId}
                onChange={(e) => {
                  setCourtId(e.target.value);
                  setSlotId("");
                  setQuote(null);
                }}
              >
                <option value="">Select court</option>
                {availableCourts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (₹{c.basePrice}/hr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#A1A1A1] block mb-1.5 font-medium">Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  setQuote(null);
                }}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-[10px] border border-[#2A2A2A] bg-[#0E0E0E] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5C158]"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Slots */}
        <div className="rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
              4. Available Slots
            </label>
            <span className="text-xs text-[#A1A1A1]">
              {availableSlots.length} available
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <p className="text-xs text-[#A1A1A1] py-2">Select a court above to view slot timings.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {availableSlots.map((s) => {
                const isSelected = s.id === slotId;
                const isMemberOnly = s.access === "members";
                const isLocked = isMemberOnly && user.membershipStatus !== "approved";

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      setSlotId(s.id);
                      setQuote(null);
                    }}
                    className={`p-3.5 rounded-[10px] border text-left transition-colors flex items-center justify-between ${
                      isLocked
                        ? "opacity-40 cursor-not-allowed border-[#2A2A2A] bg-[#0E0E0E]"
                        : isSelected
                        ? "border-[#E5C158] bg-[#181818] text-white"
                        : "border-[#2A2A2A] bg-[#0E0E0E] text-[#A1A1A1] hover:border-[#3A3A3A] hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#E5C158]" />
                        <span className="font-semibold text-sm text-white">{s.label}</span>
                      </div>
                      <p className="text-[11px] text-[#A1A1A1] mt-0.5">
                        {s.peakMultiplier > 1 ? `${s.peakMultiplier}x Peak rate` : "Standard rate"}
                      </p>
                    </div>

                    {isMemberOnly ? (
                      <span className="inline-flex items-center gap-1 rounded bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/30 text-[10px] font-bold px-2 py-0.5">
                        {isLocked ? <Lock className="w-3 h-3" /> : "Member Only"}
                      </span>
                    ) : (
                      <span className="rounded bg-[#141414] text-white text-[10px] px-2 py-0.5">
                        Open
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={getQuote}
              disabled={loadingQuote || !courtId || !slotId}
              className="rounded-[10px] border border-[#2A2A2A] hover:border-[#E5C158] bg-transparent text-white font-medium px-6 py-2.5 text-xs transition-colors disabled:opacity-40"
            >
              {loadingQuote ? "Calculating..." : "Calculate Price"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Column (4 cols) */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-6 space-y-5">
          <div className="border-b border-[#1A1813] pb-3">
            <h3 className="text-lg font-bold text-white">Booking Details</h3>
            <p className="text-xs text-[#A1A1A1] mt-0.5">Instant checkout</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#141414]">
              <span className="text-[#A1A1A1]">Venue</span>
              <span className="text-white font-medium">{selectedVenue?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#141414]">
              <span className="text-[#A1A1A1]">Court</span>
              <span className="text-white font-medium">{selectedCourt?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#141414]">
              <span className="text-[#A1A1A1]">Date</span>
              <span className="text-white font-medium">{bookingDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#141414]">
              <span className="text-[#A1A1A1]">Slot</span>
              <span className="text-[#E5C158] font-semibold">{selectedSlot?.label || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#141414]">
              <span className="text-[#A1A1A1]">Member Status</span>
              <span className="text-white uppercase font-bold text-[10px]">
                {user.membershipStatus}
              </span>
            </div>
          </div>

          {quote ? (
            <div className="rounded-[10px] bg-[#0E0E0E] p-4 border border-[#2A2A2A] space-y-2.5">
              <div className="flex justify-between text-xs text-[#A1A1A1]">
                <span>Base Total</span>
                <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#E5C158]">
                <span>Member Discount</span>
                <span>-{formatCurrency(quote.discount, quote.currency)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#1A1813]">
                <span className="text-xs font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-[#E5C158]">
                  {formatCurrency(quote.total, quote.currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={confirmBooking}
                disabled={confirming}
                className="w-full mt-3 rounded-[10px] bg-[#E5C158] hover:bg-[#D4AF37] text-black font-bold py-3 text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {confirming ? "Confirming..." : "Confirm & Pay"}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-[#A1A1A1] py-2">
              Select slot and click Calculate Price to proceed.
            </p>
          )}

          <div className="text-[11px] text-[#A1A1A1] space-y-1 pt-2">
            <p className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#E5C158]" />
              Instant slot lock
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#E5C158]" />
              Free cancellation 6h prior
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
