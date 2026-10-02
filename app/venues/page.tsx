import Image from "next/image";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { store } from "@/lib/store";

export default function VenuesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Venue Discovery"
        subtitle="Explore all active venues with local timezone/currency and game availability."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {store.venues.map((venue) => {
          const venueGames = store.games.filter((game) => game.venueIds.includes(venue.id));

          return (
            <Card key={venue.id} className="space-y-3">
              <Image
                src={venue.image}
                alt={venue.name}
                width={900}
                height={400}
                className="h-56 w-full rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{venue.address}</p>
                <p className="text-xs text-[var(--gold-soft)]">
                  {venue.city} • {venue.timezone} • {venue.currency}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  Available games
                </p>
                <div className="flex flex-wrap gap-2">
                  {venueGames.map((game) => (
                    <span
                      key={game.id}
                      className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--gold-soft)]"
                    >
                      {game.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}