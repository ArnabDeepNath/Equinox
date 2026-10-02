import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Globe } from "lucide-react";
import { getVenues, getGames } from "@/lib/store";

export default async function VenuesPage() {
  const [venues, games] = await Promise.all([getVenues(), getGames()]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Global Facilities
          </span>
          <h1 className="text-4xl font-extrabold text-white mt-2 tracking-tight sm:text-5xl">
            Certified Venues & Arenas
          </h1>
          <p className="text-gray-400 mt-3 text-base">
            World-class venues equipped with professional LED lighting, international standard turf, and exclusive membership slots.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {venues.map((venue) => {
            const venueGames = games.filter((g) => g.venueIds.includes(venue.id));

            return (
              <div
                key={venue.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-amber-500/90 text-neutral-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {venue.city}
                  </span>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">{venue.name}</h2>
                    <div className="flex items-center gap-2 text-gray-300 text-sm mt-1.5">
                      <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {venue.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{venue.timezone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4 text-amber-400" />
                      <span>Currency: <strong className="text-white">{venue.currency}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Available Sports at this Venue
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {venueGames.map((game) => (
                        <span
                          key={game.id}
                          className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                        >
                          {game.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/book?venueId=${venue.id}`}
                      className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold px-6 py-3.5 text-sm transition hover:brightness-110 shadow-lg shadow-orange-500/20"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Slots at {venue.name}
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
