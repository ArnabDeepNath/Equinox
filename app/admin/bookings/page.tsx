import { requireAdmin } from "@/lib/session";
import { getBookings, getUserById, getVenues, getCourts, getSlots } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Calendar, User, Clock, CheckCircle } from "lucide-react";

export default async function AdminBookingsPage() {
  await requireAdmin();

  const [bookings, venues, courts, slots] = await Promise.all([
    getBookings(),
    getVenues(),
    getCourts(),
    getSlots(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Operational Records
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Bookings Register</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review slot reservation statuses, user contact info, court timing, and total settlement.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center text-gray-400">
            No bookings recorded yet. New customer reservations will appear here in real-time.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const venue = venues.find((item) => item.id === booking.venueId);
              const court = courts.find((item) => item.id === booking.courtId);
              const slot = slots.find((item) => item.id === booking.slotId);

              return (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20">
                        {booking.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(booking.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white pt-1">{court?.name || booking.courtId}</h3>
                    <p className="text-xs text-gray-400">
                      Venue: <strong className="text-gray-200">{venue?.name || booking.venueId}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <div>
                      <p className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Match Date
                      </p>
                      <p className="font-bold text-white mt-0.5">{booking.bookingDate}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Slot Window
                      </p>
                      <p className="font-bold text-amber-400 mt-0.5">{slot?.label || booking.slotId}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Customer ID</p>
                      <p className="font-mono text-gray-200 mt-0.5">{booking.userId}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Total Settled</p>
                      <p className="font-black text-base text-emerald-400 mt-0.5">
                        {formatCurrency(booking.total, booking.currency)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="font-bold uppercase tracking-wider text-[10px]">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
