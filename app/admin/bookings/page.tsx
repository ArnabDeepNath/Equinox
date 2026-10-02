export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAdmin } from "@/lib/session";
import { getBookings, getVenues, getCourts, getSlots } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { AdminBookingActions } from "@/components/admin-booking-actions";

export default async function AdminBookingsPage() {
  await requireAdmin();

  const [bookings, venues, courts, slots] = await Promise.all([
    getBookings(),
    getVenues(),
    getCourts(),
    getSlots(),
  ]);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const processedBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#F5B301]">
            Reservations Control
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">Bookings Register & Approvals</h1>
          <p className="text-sm text-[#A1A1A1] mt-1">
            Review slot reservation requests. Approving or rejecting instantly triggers real SMTP emails to the player.
          </p>
        </div>

        {/* 1. Pending Approvals Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F5B301] animate-pulse"></span>
              <h2 className="text-lg font-bold text-white">Pending Approval Queue</h2>
            </div>
            <span className="rounded-full bg-[#F5B301]/10 text-[#F5B301] border border-[#F5B301]/30 text-xs px-2.5 py-0.5 font-bold">
              {pendingBookings.length} Awaiting Review
            </span>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-8 text-center text-[#A1A1A1] text-xs">
              No pending booking requests right now. New checkout requests will land here for your decision.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => {
                const venue = venues.find((v) => v.id === b.venueId);
                const court = courts.find((c) => c.id === b.courtId);
                const slot = slots.find((s) => s.id === b.slotId);

                return (
                  <div
                    key={b.id}
                    className="rounded-[16px] bg-[#121212] border border-[#F5B301]/40 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-[#1A1A1A] text-[#F5B301] px-2.5 py-0.5 rounded font-bold">
                          {b.id}
                        </span>
                        <span className="text-[11px] text-[#A1A1A1]">
                          Submitted: {new Date(b.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{court?.name || b.courtId}</h3>
                      <p className="text-xs text-[#A1A1A1]">
                        Venue: <strong className="text-white">{venue?.name || b.venueId}</strong> · Customer ID: <strong className="text-white font-mono">{b.userId}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs">
                      <div>
                        <span className="text-[#A1A1A1] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#F5B301]" />
                          Date
                        </span>
                        <p className="font-semibold text-white mt-0.5">{b.bookingDate}</p>
                      </div>

                      <div>
                        <span className="text-[#A1A1A1] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#F5B301]" />
                          Slot Window
                        </span>
                        <p className="font-semibold text-[#F5B301] mt-0.5">{slot?.label || b.slotId}</p>
                      </div>

                      <div>
                        <span className="text-[#A1A1A1]">Total Amount</span>
                        <p className="font-black text-base text-white mt-0.5">
                          {formatCurrency(b.total, b.currency)}
                        </p>
                      </div>

                      <div className="pt-2 lg:pt-0">
                        <AdminBookingActions bookingId={b.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Processed History */}
        <div className="space-y-4 pt-6">
          <div className="border-b border-[#1E1E1E] pb-3">
            <h2 className="text-lg font-bold text-white">Processed Bookings History</h2>
          </div>

          {processedBookings.length === 0 ? (
            <div className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-6 text-center text-[#A1A1A1] text-xs">
              No historical decisions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {processedBookings.map((b) => {
                const venue = venues.find((v) => v.id === b.venueId);
                const court = courts.find((c) => c.id === b.courtId);
                const slot = slots.find((s) => s.id === b.slotId);
                const isConfirmed = b.status === "confirmed";

                return (
                  <div
                    key={b.id}
                    className="rounded-[12px] bg-[#121212] border border-[#1E1E1E] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-medium">{b.id}</span>
                        <span className="text-[#A1A1A1]">({b.bookingDate})</span>
                      </div>
                      <p className="text-white font-semibold mt-1">
                        {court?.name || b.courtId} <span className="text-[#A1A1A1]">at {venue?.name || b.venueId}</span>
                      </p>
                      <p className="text-[#A1A1A1] mt-0.5">
                        Slot: {slot?.label || b.slotId} · User: {b.userId}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(b.total, b.currency)}
                      </span>

                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 font-bold text-[10px] uppercase">
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelled / Rejected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
