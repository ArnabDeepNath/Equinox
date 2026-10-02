export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getBookings, getVenues, getCourts, getSlots } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

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
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4">
        <div className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-8 max-w-md w-full text-center space-y-4">
          <p className="text-[#A1A1A1] text-sm">Booking details not found.</p>
          <Link
            href="/book"
            className="inline-block rounded-[10px] bg-[#F5B301] text-black font-semibold px-5 py-2.5 text-xs"
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
    <div className="min-h-screen bg-[#0B0B0B] text-white py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-8 space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center text-[#F5B301]">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B301]">
              Awaiting Admin Approval
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">Booking Submitted</h1>
            <p className="text-xs text-[#A1A1A1] mt-1 leading-relaxed">
              Your request and mock payment have been recorded. The venue administrator will review and you will receive an approval email at your registered email address.
            </p>
          </div>

          <div className="rounded-[12px] bg-[#0E0E0E] border border-[#1E1E1E] p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#1E1E1E]">
              <span className="text-[#A1A1A1]">Reference ID</span>
              <span className="font-mono text-white font-medium">{booking.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A1A1A1]">Venue</span>
              <span className="font-semibold text-white">{venue?.name || booking.venueId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A1A1A1]">Court</span>
              <span className="text-white">{court?.name || booking.courtId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A1A1A1]">Slot</span>
              <span className="text-[#F5B301] font-medium">{booking.bookingDate} · {slot?.label || booking.slotId}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#1E1E1E]">
              <span className="text-[#A1A1A1]">Status</span>
              <span className="text-xs font-bold uppercase bg-[#F5B301]/10 text-[#F5B301] border border-[#F5B301]/30 px-2.5 py-0.5 rounded">
                Pending Approval
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#1E1E1E]">
              <span className="text-[#A1A1A1]">Amount</span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(booking.total, booking.currency)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/book"
              className="flex-1 text-center rounded-[10px] border border-[#2A2A2A] hover:border-[#3A3A3A] py-3 text-xs font-semibold text-white transition-colors"
            >
              Book Another
            </Link>
            <Link
              href="/"
              className="flex-1 text-center rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-semibold py-3 text-xs transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
