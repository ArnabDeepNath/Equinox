"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { store } from "@/lib/store";
import { AppUser } from "@/lib/types";

interface BookingFlowProps {
  user: AppUser;
}

interface QuoteState {
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export function BookingFlow({ user }: BookingFlowProps) {
  const router = useRouter();
  const [venueId, setVenueId] = useState(store.venues[0]?.id ?? "");
  const [gameId, setGameId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const availableGames = useMemo(
    () => store.games.filter((game) => game.venueIds.includes(venueId)),
    [venueId],
  );

  const availableCourts = useMemo(
    () => store.courts.filter((court) => court.venueId === venueId && court.gameId === gameId),
    [venueId, gameId],
  );

  const availableSlots = useMemo(
    () => store.slots.filter((slot) => slot.courtId === courtId),
    [courtId],
  );

  async function getQuote() {
    if (!courtId || !slotId || !bookingDate) {
      toast.error("Please complete venue/game/court/slot/date");
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
      toast.error("Get quote before payment");
      return;
    }

    setConfirming(true);
    try {
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          gameId,
          courtId,
          slotId,
          bookingDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Payment failed");
      }

      toast.success("Mock payment successful. Booking confirmed!");
      router.push(`/book/confirmation?bookingId=${data.booking.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold">Select game, court and slot</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Venue</label>
            <select
              className="w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm"
              value={venueId}
              onChange={(event) => {
                setVenueId(event.target.value);
                setGameId("");
                setCourtId("");
                setSlotId("");
                setQuote(null);
              }}
            >
              {store.venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} ({venue.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Game</label>
            <select
              className="w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm"
              value={gameId}
              onChange={(event) => {
                setGameId(event.target.value);
                setCourtId("");
                setSlotId("");
                setQuote(null);
              }}
            >
              <option value="">Select game</option>
              {availableGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Court</label>
            <select
              className="w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm"
              value={courtId}
              onChange={(event) => {
                setCourtId(event.target.value);
                setSlotId("");
                setQuote(null);
              }}
            >
              <option value="">Select court</option>
              {availableCourts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Slot</label>
            <select
              className="w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm"
              value={slotId}
              onChange={(event) => {
                setSlotId(event.target.value);
                setQuote(null);
              }}
            >
              <option value="">Select slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label} {slot.access === "members" ? "(Members only)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Booking date</label>
          <Input
            type="date"
            value={bookingDate}
            onChange={(event) => {
              setBookingDate(event.target.value);
              setQuote(null);
            }}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <Button onClick={getQuote} disabled={loadingQuote}>
          {loadingQuote ? "Calculating..." : "Calculate Price"}
        </Button>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Pricing & Payment (POC)</h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Member status: <span className="text-[var(--gold-soft)]">{user.membershipStatus}</span>
        </p>
        {quote ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Membership discount</span>
              <span>-{formatCurrency(quote.discount, quote.currency)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(quote.total, quote.currency)}</span>
            </div>
            <Button className="w-full" onClick={confirmBooking} disabled={confirming}>
              {confirming ? "Processing mock payment..." : "Proceed to Mock Payment"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            Select your slot and calculate price to continue.
          </p>
        )}
      </Card>
    </div>
  );
}