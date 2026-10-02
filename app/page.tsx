import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Play,
  Clock,
  CreditCard,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getVenues, getGames } from "@/lib/store";

export default async function Home() {
  const [user, venues, games] = await Promise.all([
    getCurrentUser(),
    getVenues(),
    getGames(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 font-sans selection:bg-amber-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/15 via-neutral-950 to-neutral-950"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 mr-2.5 animate-pulse"></span>
                Next-Gen Multi-Sport Venue Booking
              </div>

              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-6 leading-tight">
                Book{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">
                  Paddle, Football, Table Tennis
                </span>{" "}
                & More in Seconds.
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                Equinox Sports is a multi-venue booking PWA with membership-based conditional slots, dynamic pricing, role-based access, and a passionate sports community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/book"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-neutral-950 transition-all duration-300 hover:from-amber-400 hover:to-orange-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:-translate-y-0.5"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Slot
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/community"
                  className="group inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
                >
                  <Users className="mr-2 h-5 w-5 text-amber-400" />
                  Join Community
                </Link>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="relative lg:ml-auto w-full max-w-lg aspect-square lg:aspect-auto lg:h-[580px] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop"
                alt="Premium sports venue"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="flex items-center gap-4 backdrop-blur-md bg-black/60 p-4 rounded-2xl border border-white/15">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Play className="w-5 h-5 text-neutral-950 ml-0.5 fill-current" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Equinox Experience</p>
                    <p className="text-gray-300 text-xs">Curated world-class indoor & outdoor courts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Snapshot (if signed in) or CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {user ? (
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-neutral-900/90 to-neutral-900/50 backdrop-blur-md p-6 sm:p-8 transition-all hover:border-amber-500/50">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"></div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-1">
                  Active Player Profile
                </p>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {user.name}
                  {user.role === "admin" && (
                    <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Role: <strong className="text-white capitalize">{user.role}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Membership:{" "}
                    <strong
                      className={`capitalize ${
                        user.membershipStatus === "approved"
                          ? "text-emerald-400"
                          : user.membershipStatus === "pending"
                          ? "text-amber-400"
                          : "text-gray-400"
                      }`}
                    >
                      {user.membershipStatus}
                    </strong>
                  </span>
                </div>

                {user.membershipStatus !== "approved" && (
                  <Link
                    href="/membership"
                    className="rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 text-sm transition"
                  >
                    Request Full Membership
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                VIP Member Benefits
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Unlock Exclusive Peak Windows & Member Discounts
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xl">
                Create your account or sign in to request official membership. Approved members save up to 20% on all courts.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/join"
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 text-sm font-semibold text-white transition"
              >
                Join as Member
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold px-6 py-3 text-sm transition shadow-lg hover:brightness-110"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Popular Games */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Popular Games</h2>
            <p className="text-gray-400 text-sm mt-1">
              Select your sport and book courts across our certified venues.
            </p>
          </div>
          <Link
            href="/book"
            className="text-amber-400 hover:text-amber-300 font-semibold text-sm inline-flex items-center gap-1"
          >
            Explore all courts <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-neutral-900/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-sm text-gray-400 mb-6 flex-1 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {game.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Venues */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Venues</h2>
            <p className="text-gray-400 text-sm mt-1">
              Multi-venue network with venue-specific currency, slots, and timezones.
            </p>
          </div>
          <Link
            href="/venues"
            className="text-amber-400 hover:text-amber-300 font-semibold text-sm inline-flex items-center gap-1"
          >
            View all venues <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{venue.name}</h3>
                <div className="flex items-center gap-2 text-gray-300 mb-2 text-sm">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {venue.address}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium tracking-wide">
                  <span className="bg-white/10 px-2.5 py-1 rounded-md text-gray-200">
                    {venue.city}
                  </span>
                  <span>{venue.timezone}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{venue.currency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "Membership Slots",
              desc: "Members get exclusive morning/evening timing windows, priority booking, and automated pricing discounts.",
            },
            {
              icon: CreditCard,
              title: "Dynamic Pricing Engine",
              desc: "Instant pricing calculation with base price, slot multipliers, and membership tier discounts applied.",
            },
            {
              icon: Users,
              title: "Interactive Community",
              desc: "Connect with paddle and football players, organize weekend tournaments, and share match highlights.",
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/50 to-neutral-900/20 p-8 transition-all hover:bg-neutral-900/80 hover:border-amber-500/30 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 py-10 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Equinox Sports. Built with Next.js, Firebase & PWA.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/venues" className="hover:text-amber-400">Venues</Link>
            <Link href="/book" className="hover:text-amber-400">Booking</Link>
            <Link href="/community" className="hover:text-amber-400">Community</Link>
            <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
