import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Globe, Calendar } from "lucide-react";
import { getVenues, getGames, getCourts, getSlots } from "@/lib/store";

export default async function VenuesPage() {
  const [venues, games, courts, slots] = await Promise.all([
    getVenues(),
    getGames(),
    getCourts(),
    getSlots(),
  ]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-xl">
          <span className="text-xs uppercase font-bold tracking-wider text-[#F5B301]">
            Verified Facilities
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Sports Venues in Your City
          </h1>
          <p className="text-sm text-[#A1A1A1] mt-2">
            Explore club courts, real-time hourly rates, and book slots directly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {venues.map((venue) => {
            const venueGames = games.filter((g) => g.venueIds.includes(venue.id));
            const venueCourts = courts.filter((c) => c.venueId === venue.id);
            const minPrice = venueCourts.length
              ? Math.min(...venueCourts.map((c) => c.basePrice))
              : 1000;
            const venueSlots = slots.filter((s) =>
              venueCourts.some((c) => c.id === s.courtId)
            );

            return (
              <div
                key={venue.id}
                className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] overflow-hidden flex flex-col justify-between hover:border-[#2A2A2A] transition-colors"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-[#0B0B0B]/90 text-white text-xs font-semibold px-3 py-1 rounded">
                    {venue.city}
                  </span>
                </div>

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{venue.name}</h2>
                    <p className="text-xs text-[#A1A1A1] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F5B301]" />
                      {venue.address}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-y border-[#1E1E1E] my-4 py-3 text-xs text-[#A1A1A1]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F5B301]" />
                        <span>{venue.timezone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#F5B301]" />
                        <span>Currency: <strong className="text-white">{venue.currency}</strong></span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#A1A1A1] uppercase tracking-wider">
                        Available Sports
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {venueGames.map((game) => (
                          <span
                            key={game.id}
                            className="rounded-full border border-[#2A2A2A] bg-[#181818] px-3 py-1 text-xs text-white"
                          >
                            {game.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#A1A1A1]">From</span>
                      <p className="text-lg font-bold text-white">₹{minPrice} <span className="text-xs font-normal text-[#A1A1A1]">/ hr</span></p>
                    </div>

                    <Link
                      href={`/book?venueId=${venue.id}`}
                      className="rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-semibold px-5 py-2.5 text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
