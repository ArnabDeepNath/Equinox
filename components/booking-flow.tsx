"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  Sparkles,
  CheckCircle2,
  Lock,
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
      toast.success("Price calculated successfully");
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

      toast.success("Payment successful! Confirmation sent.");
      router.push(`/book/confirmation?bookingId=${data.booking.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Selection Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Venue */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Step 1 · Choose Venue
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
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
                  className={`relative text-left p-4 rounded-2xl border transition-all ${
                    active
                      ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                      : "border-white/10 bg-neutral-950/60 hover:border-white/20"
                  }`}
                >
                  <p className="font-bold text-white text-base">{v.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {v.city} · {v.currency}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Sport */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Step 2 · Select Game
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    active
                      ? "border-amber-500 bg-amber-500/15 text-white font-bold"
                      : "border-white/10 bg-neutral-950/60 text-gray-300 hover:border-white/20"
                  }`}
                >
                  <p className="text-sm font-semibold">{g.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Court & Date */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 space-y-4">
          <label className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Step 3 · Pick Court & Date
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5 font-medium">Court</label>
              <select
                className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                value={courtId}
                onChange={(e) => {
                  setCourtId(e.target.value);
                  setSlotId("");
                  setQuote(null);
                }}
              >
                <option value="">Select available court</option>
                {availableCourts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Base ₹{c.basePrice} · {c.memberDiscountPercent}% Member Disc)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1.5 font-medium">Reservation Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  setQuote(null);
                }}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Slots */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Step 4 · Available Time Slots
            </label>
            <span className="text-xs text-gray-400">
              {availableSlots.length} slot(s) for this court
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <p className="text-sm text-gray-500 py-3">Please select a court to view timing slots.</p>
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
                    className={`relative p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isLocked
                        ? "opacity-50 cursor-not-allowed border-dashed border-red-500/30 bg-red-950/10"
                        : isSelected
                        ? "border-amber-500 bg-amber-500/20 shadow-md shadow-amber-500/10 text-white"
                        : "border-white/10 bg-neutral-950/60 hover:border-white/30 text-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm text-white">{s.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Multiplier: {s.peakMultiplier}x
                      </p>
                    </div>

                    {isMemberOnly ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5">
                        {isLocked ? <Lock className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3" />}
                        Member Only
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/20">
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
              className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 text-sm transition disabled:opacity-40"
            >
              {loadingQuote ? "Calculating Total..." : "Calculate Price"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary / Payment Column */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white">Booking Summary</h3>
            <p className="text-xs text-gray-400 mt-0.5">Instant checkout powered by Equinox</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Venue</span>
              <span className="text-white font-medium">{selectedVenue?.name || "Not selected"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Court</span>
              <span className="text-white font-medium">{selectedCourt?.name || "Not selected"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Date</span>
              <span className="text-white font-medium">{bookingDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Slot</span>
              <span className="text-amber-400 font-bold">{selectedSlot?.label || "Not selected"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Member Status</span>
              <span className="text-white uppercase font-bold text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {user.membershipStatus}
              </span>
            </div>
          </div>

          {quote ? (
            <div className="rounded-2xl bg-neutral-950 p-4 border border-amber-500/30 space-y-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400 font-medium">
                <span>Member Discount</span>
                <span>-{formatCurrency(quote.discount, quote.currency)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-amber-400">
                  {formatCurrency(quote.total, quote.currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={confirmBooking}
                disabled={confirming}
                className="w-full mt-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-black py-4 text-sm transition hover:brightness-110 shadow-xl shadow-orange-500/20 disabled:opacity-50"
              >
                {confirming ? "Processing Mock Payment..." : "Pay & Confirm Booking"}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-gray-400">
              Select all options and click <strong className="text-amber-400">Calculate Price</strong> to review pricing breakdown.
            </div>
          )}

          <div className="text-[11px] text-gray-400 space-y-1.5 pt-2">
            <div className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant slot block upon successful payment</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Free cancellation up to 6 hours before match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
