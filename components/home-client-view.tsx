"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppUser, Venue, Game, Court, Slot } from "@/lib/types";
import {
  MapPin,
  Calendar,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { BgVideo } from "@/components/bg-video";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";

interface Props {
  user: AppUser | null;
  venues: Venue[];
  games: Game[];
  courts: Court[];
  slots: Slot[];
}

const SPORT_COLLECTIONS = [
  {
    key: "Paddle",
    title: "Paddle",
    tagline: "Fast glass-wall rallies under gold floodlights.",
    mp4: "/videos/paddle.mp4",
    poster: "/videos/paddle-poster.jpg",
  },
  {
    key: "Football",
    title: "Football Turf",
    tagline: "Five-a-side on pro-grade night turf.",
    mp4: "/videos/football.mp4",
    poster: "/videos/football-poster.jpg",
  },
  {
    key: "Table Tennis",
    title: "Table Tennis",
    tagline: "Indoor precision on tournament tables.",
    mp4: "/videos/table-tennis.mp4",
    poster: "/videos/table-tennis-poster.jpg",
  },
];

const MARQUEE_ITEMS = [
  "Equinox",
  "The Sports Commune",
  "Paddle",
  "Football Turf",
  "Table Tennis",
  "Guwahati",
  "Live Availability",
  "Instant Booking",
];

export function HomeClientView({ user, venues, games, courts, slots }: Props) {
  const [selectedSport, setSelectedSport] = useState<string>("All");

  const filteredVenues = venues.filter((venue) => {
    if (selectedSport === "All") return true;
    const matchingGame = games.find(
      (g) => g.name.toLowerCase() === selectedSport.toLowerCase(),
    );
    if (!matchingGame) return true;
    return matchingGame.venueIds.includes(venue.id);
  });

  function selectSport(sport: string) {
    setSelectedSport(sport);
    document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" });
  }

  const heroStats = [
    { value: "50+", label: "Verified Venues", gold: false },
    { value: "10,000+", label: "Slots Booked", gold: false },
    { value: "100%", label: "Live Availability", gold: true },
    { value: "Instant", label: "Confirmed Checkout", gold: false },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* 1. HERO — full-bleed cinematic video */}
      <section className="relative -mt-[72px] flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <BgVideo
          mp4="/videos/hero.mp4"
          poster="/videos/hero-poster.jpg"
          eager
          ariaLabel="Cinematic loop of a floodlit sports court at night"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/80 via-[#060606]/35 to-[#060606]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/70 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-44 pb-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5C158]/30 bg-black/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E5C158] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5C158]" />
              Live Court Availability · Guwahati
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[1.04] tracking-tight text-white sm:text-7xl lg:text-[88px]">
              The City&rsquo;s Finest Courts,{" "}
              <span className="gold-gradient-text italic">One Commune</span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#C9C9C9] sm:text-lg">
              Real-time availability. Transparent pricing. No calls, no waiting.
              Paddle, football turf, and table tennis — booked in seconds.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="gold-button inline-flex items-center gap-2 rounded-[10px] px-7 py-4 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Book a Venue
              </Link>
              <Link
                href="#sports"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 bg-black/30 px-7 py-4 text-sm font-medium text-white backdrop-blur transition-colors hover:border-[#E5C158]/60 hover:text-[#E5C158]"
              >
                Explore the Sports
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {user ? (
            <Reveal delay={460}>
              <p className="mt-7 text-xs tracking-wide text-[#A1A1A1]">
                Welcome back,{" "}
                <span className="font-semibold text-[#E5C158]">
                  {user.name.split(" ")[0]}
                </span>{" "}
                — your commune is ready.
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* Floating stat bar */}
        <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p
                  className={`font-display text-2xl sm:text-3xl ${
                    stat.gold ? "text-[#E5C158]" : "text-white"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#A1A1A1]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GOLD TICKER */}
      <Marquee items={MARQUEE_ITEMS} />

      {/* 3. THE COLLECTIONS — editorial sport cards */}
      <section id="sports" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                  The Collections
                </p>
                <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
                  Choose Your Arena
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#A1A1A1]">
                Three sports. One standard — immaculate courts, honest pricing,
                instant confirmation.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {SPORT_COLLECTIONS.map((sport, index) => (
              <Reveal key={sport.key} delay={index * 120}>
                <button
                  type="button"
                  onClick={() => selectSport(sport.key)}
                  className="group relative block h-[440px] w-full overflow-hidden rounded-[20px] border border-[#1A1813] text-left transition-all duration-500 hover:border-[#E5C158]/50 hover:shadow-[0_20px_60px_-20px_rgba(229,193,88,0.25)]"
                >
                  <BgVideo
                    mp4={sport.mp4}
                    poster={sport.poster}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E5C158]">
                      0{index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-white">
                      {sport.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#C9C9C9]">
                      {sport.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors group-hover:text-[#E5C158]">
                      View venues
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED VENUES */}
      <section
        id="venues"
        className="relative border-t border-[#141414] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                  Featured Venues
                </p>
                <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
                  Reserve Your Slot
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#A1A1A1]">
                  Filter by sport and book directly with upfront pricing.
                </p>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center gap-2">
                {["All", "Paddle", "Football", "Table Tennis"].map((sport) => {
                  const isSelected = selectedSport === sport;
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => setSelectedSport(sport)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-[#E5C158] text-black"
                          : "border border-[#2A2A2A] text-[#A1A1A1] hover:border-[#E5C158]/50 hover:text-white"
                      }`}
                    >
                      {sport}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue, index) => {
              const venueCourts = courts.filter((c) => c.venueId === venue.id);
              const minPrice = venueCourts.length
                ? Math.min(...venueCourts.map((c) => c.basePrice))
                : 1000;
              const venueSlots = slots.filter((s) =>
                venueCourts.some((c) => c.id === s.courtId),
              );

              return (
                <Reveal
                  key={venue.id}
                  delay={(index % 3) * 100}
                  className="h-full"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#1A1813] bg-[#0B0B0A] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#E5C158]/40 hover:shadow-[0_24px_70px_-24px_rgba(229,193,88,0.28)]">
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                        {venue.city}
                      </span>
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#E5C158]/30 bg-[#E5C158]/15 px-3 py-1 text-[11px] font-semibold text-[#E5C158] backdrop-blur">
                        <Clock className="h-3 w-3" />
                        {venueSlots.length
                          ? `${venueSlots.length} slots open`
                          : "Open daily"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-2xl text-white">
                        {venue.name}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A1A1A1]">
                        <MapPin className="h-3.5 w-3.5 text-[#E5C158]" />
                        {venue.address}
                      </p>

                      <div className="mt-5 flex flex-1 items-end justify-between border-t border-[#1A1813] pt-5">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-[#A1A1A1]">
                            Starting from
                          </span>
                          <p className="font-display text-2xl text-[#E5C158]">
                            ₹{minPrice}
                            <span className="ml-1 text-xs font-normal text-[#A1A1A1]">
                              / hour
                            </span>
                          </p>
                        </div>
                        <Link
                          href={`/book?venueId=${venue.id}`}
                          className="inline-flex items-center gap-2 rounded-[10px] border border-[#2A2A2A] bg-[#161511] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-[#E5C158] hover:bg-[#E5C158] hover:text-black"
                        >
                          Book
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {filteredVenues.length === 0 ? (
            <p className="mt-10 text-center text-sm text-[#A1A1A1]">
              No venues listed for this sport yet — check back soon.
            </p>
          ) : null}
        </div>
      </section>

      {/* 5. THE EXPERIENCE — editorial split with video */}
      <section className="relative border-t border-[#141414] bg-[#080807] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative h-[420px] overflow-hidden rounded-[20px] border border-[#1A1813] sm:h-[520px]">
              <BgVideo
                mp4="/videos/experience.mp4"
                poster="/videos/experience-poster.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                The Equinox Standard
              </p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">
                Not Just a Booking.{" "}
                <span className="gold-gradient-text italic">A Ritual.</span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
                Every venue in the commune is vetted in person — lighting,
                surface, lockers, water. If it carries the Equinox mark, it
                plays like a professional facility.
              </p>
            </Reveal>

            <div className="mt-9 space-y-5">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified venues, audited monthly",
                  body: "Surfaces, nets, lighting and amenities inspected on a rolling schedule.",
                },
                {
                  icon: BadgeCheck,
                  title: "Transparent upfront pricing",
                  body: "The price you see is the price you pay. No calls, no negotiation.",
                },
                {
                  icon: Zap,
                  title: "Instant confirmation",
                  body: "Email and WhatsApp alerts the second your slot is locked.",
                },
                {
                  icon: Clock,
                  title: "Members-only peak windows",
                  body: "Prime morning and evening slots reserved for Club Pass holders.",
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={180 + index * 90}>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5C158]/25 bg-[#E5C158]/10">
                      <item.icon className="h-4.5 w-4.5 text-[#E5C158]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#A1A1A1]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS — oversized gold numerals */}
      <section className="border-t border-[#141414] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                How It Works
              </p>
              <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
                Three Steps to Court Time
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Venue",
                body: "Browse verified venues across Guwahati with amenities, photos and live calendars.",
              },
              {
                step: "02",
                title: "Pick Your Slot",
                body: "Real-time morning and evening slots. No double-booking, no phone calls.",
              },
              {
                step: "03",
                title: "Book Instantly",
                body: "Confirm in seconds with immediate email and WhatsApp alerts.",
              },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 120}>
                <div className="border-t border-[#1A1813] pt-8">
                  <p className="gold-gradient-text font-display text-6xl sm:text-7xl">
                    {item.step}
                  </p>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#A1A1A1]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEMBERSHIP — the gold card */}
      <section
        id="pricing"
        className="relative overflow-hidden border-t border-[#141414] py-24 sm:py-32"
      >
        {/* Radial gold ambience */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5C158]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-14 max-w-xl text-center">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                <Sparkles className="h-3.5 w-3.5" />
                For Regular Players
              </p>
              <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
                Play More, Pay Less
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
                Priority booking windows, discounted court pricing across all
                games, and access to members-only peak slots.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="gold-pulse mx-auto max-w-2xl rounded-[22px] bg-gradient-to-br from-[#E5C158]/70 via-[#E5C158]/15 to-[#E5C158]/5 p-px">
              <div className="rounded-[21px] bg-[#0B0A08] p-8 sm:p-12">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A1A1A1]">
                      Equinox Club Pass
                    </span>
                    <p className="mt-3 font-display text-5xl text-white sm:text-6xl">
                      ₹999
                      <span className="ml-2 align-middle text-sm font-normal text-[#A1A1A1]">
                        / month
                      </span>
                    </p>
                  </div>
                  <Link
                    href="/membership"
                    className="gold-button inline-flex items-center justify-center gap-2 rounded-[10px] px-7 py-4 text-sm"
                  >
                    Apply for Membership
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="gold-hairline my-9" />

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  {[
                    "Priority booking 7 days in advance",
                    "Up to 20% flat discount on all courts",
                    "Exclusive peak morning & evening slots",
                    "Complimentary locker & equipment support",
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 flex-shrink-0 text-[#E5C158]" />
                      <span className="text-white">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative border-t border-[#141414] py-28 text-center sm:py-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E5C158]">
              Game On
            </p>
            <h2 className="mt-4 font-display text-5xl leading-tight text-white sm:text-6xl">
              Your court is{" "}
              <span className="gold-gradient-text italic">waiting.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
              Join the commune. Book your first slot in under a minute.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book"
                className="gold-button inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Book Now
              </Link>
              <Link
                href="/venues"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#2A2A2A] px-8 py-4 text-sm font-medium text-white transition-colors hover:border-[#E5C158]/60 hover:text-[#E5C158]"
              >
                Browse Venues
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
