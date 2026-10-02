import Link from "next/link";
import { getBookings, getVenues, getCourts, getSlots } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const params = await searchParams;
  const bookings = await getBookings();
  const booking = bookings.find((item) => item.id === params.bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-950 text-slate-50 flex items-center justify-center p-4">
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8 max-w-md w-full text-center space-y-4">
          <p className="text-gray-400 text-sm">Booking details not found or expired.</p>
          <Link
            href="/book"
            className="inline-block rounded-full bg-amber-500 text-neutral-950 font-bold px-6 py-2.5 text-sm"
          >
            Go to Booking
          </Link>
        </div>
      </div>
    );
  }

  const [venues, courts, slots] = await Promise.all([
    getVenues(),
    getCourts(),
    getSlots(),
  ]);

  const venue = venues.find((item) => item.id === booking.venueId);
  const court = courts.find((item) => item.id === booking.courtId);
  const slot = slots.find((item) => item.id === booking.slotId);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-neutral-900/90 to-neutral-900/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>

          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
            Slot Locked & Confirmed
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Booking Confirmed!</h1>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">
            Your court has been reserved. A confirmation email has been dispatched and WhatsApp notification logged.
          </p>

          <div className="my-8 rounded-2xl bg-neutral-950/80 border border-white/10 p-6 space-y-3.5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-gray-400">Booking Reference</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{booking.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Venue</span>
              <span className="font-bold text-white text-right">{venue?.name || booking.venueId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Court</span>
              <span className="font-bold text-gray-200">{court?.name || booking.courtId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Date & Slot</span>
              <span className="font-bold text-white">
                {booking.bookingDate} · {slot?.label || booking.slotId}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
              <span className="text-gray-400 font-semibold">Total Paid</span>
              <span className="text-xl font-black text-emerald-400">
                {formatCurrency(booking.total, booking.currency)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="flex-1 text-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition"
            >
              Book Another Slot
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center text-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold px-6 py-3.5 text-sm transition hover:brightness-110 shadow-lg"
            >
              Return to Home
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
