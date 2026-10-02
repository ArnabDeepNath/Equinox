import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/section-title";
import { UserSummary } from "@/components/user-summary";
import { getCurrentUser } from "@/lib/session";
import { store } from "@/lib/store";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--gold-soft)]">
            Premium Sports Booking Platform
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Book Paddle, Football, Table Tennis & More in Seconds.
          </h1>
          <p className="max-w-xl text-sm text-[var(--muted-foreground)] sm:text-base">
            Equinox Sports is a multi-venue booking PWA with membership based exclusive slots,
            dynamic pricing, secure role-based access, and a vibrant sports community.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/book">
              <Button>Book a Slot</Button>
            </Link>
            <Link href="/community">
              <Button variant="secondary">Join Community</Button>
            </Link>
            {!user ? (
              <Link href="/join">
                <Button variant="secondary">Become a Member</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <Image
            src="https://images.unsplash.com/photo-1543351611-58f69d0f7df5?q=80&w=1200&auto=format&fit=crop"
            alt="Premium sports venue"
            width={900}
            height={600}
            className="h-full min-h-[320px] w-full object-cover"
          />
        </Card>
      </section>

      {user ? (
        <section>
          <SectionTitle
            title="Your Membership Snapshot"
            subtitle="Use your profile and membership status to unlock exclusive member slots."
          />
          <UserSummary user={user} />
        </section>
      ) : null}

      <section>
        <SectionTitle title="Popular Games" subtitle="Configured by admin with venue-specific courts and features." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {store.games.map((game) => (
            <Card key={game.id} className="space-y-3">
              <Image
                src={game.image}
                alt={game.name}
                width={600}
                height={350}
                className="h-44 w-full rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold">{game.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                {game.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--gold-soft)]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Active Venues" subtitle="Timezone and currency managed venue-wise by admin." />
        <div className="grid gap-4 md:grid-cols-2">
          {store.venues.map((venue) => (
            <Card key={venue.id} className="space-y-3">
              <Image
                src={venue.image}
                alt={venue.name}
                width={700}
                height={400}
                className="h-44 w-full rounded-lg object-cover"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{venue.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{venue.address}</p>
                <p className="text-xs text-[var(--gold-soft)]">
                  {venue.city} · {venue.timezone} · {venue.currency}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Membership Access</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Members get exclusive timing windows and discounted pricing for each court.
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 text-lg font-semibold">POC Payments</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Mock payment flow is active now. Razorpay/Instamojo connectors can plug in next.
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Community First</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Users can create posts, comment, and like discussions around their favorite sports.
          </p>
        </Card>
      </section>
    </div>
  );
}
