import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getVenues, getGames, getCourts, getSlots } from "@/lib/store";
import { BookingFlow } from "@/components/booking-flow";
import { Sparkles } from "lucide-react";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ venueId?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/book");
  }

  const resolvedParams = await searchParams;

  const [venues, games, courts, slots] = await Promise.all([
    getVenues(),
    getGames(),
    getCourts(),
    getSlots(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
              Direct Reservation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Select Court & Reserve Slot
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time slot availability, instant dynamic pricing calculations, and mock checkout.
            </p>
          </div>

          {user.membershipStatus !== "approved" && (
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Request Membership for 20% Discount
            </Link>
          )}
        </div>

        <BookingFlow
          user={user}
          venues={venues}
          games={games}
          courts={courts}
          slots={slots}
          initialVenueId={resolvedParams.venueId}
        />
      </div>
    </div>
  );
}
