export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getVenues, getGames, getCourts, getSlots } from "@/lib/store";
import { BookingFlow } from "@/components/booking-flow";

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
    <div className="min-h-screen bg-[#060606] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1813] pb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#E5C158]">
              Live Booking Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              Reserve Your Court
            </h1>
            <p className="text-sm text-[#A1A1A1] mt-1">
              Select venue, sport, and match time. Instant confirmation & transparent pricing.
            </p>
          </div>

          {user.membershipStatus !== "approved" && (
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#E5C158] px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              <span className="text-[#E5C158]">★</span>
              Unlock 20% Member Discount
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
