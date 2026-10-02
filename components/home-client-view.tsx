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
} from "lucide-react";

interface Props {
  user: AppUser | null;
  venues: Venue[];
  games: Game[];
  courts: Court[];
  slots: Slot[];
}

export function HomeClientView({ user, venues, games, courts, slots }: Props) {
  const [selectedSport, setSelectedSport] = useState<string>("All");

  const filteredVenues = venues.filter((venue) => {
    if (selectedSport === "All") return true;
    const matchingGame = games.find(
      (g) => g.name.toLowerCase() === selectedSport.toLowerCase()
    );
    if (!matchingGame) return true;
    return matchingGame.venueIds.includes(venue.id);
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#1A1A1A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (6 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A2A2A] bg-[#121212] text-xs font-medium text-[#A1A1A1]">
                <span className="w-2 h-2 rounded-full bg-[#F5B301]"></span>
                Live Court Availability Across Mumbai & Bengaluru
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.1]">
                Book Sports Venues
                <br />
                <span className="text-[#F5B301]">Across Your City</span>
              </h1>

              <p className="text-base sm:text-lg text-[#A1A1A1] max-w-xl leading-relaxed">
                Real-time availability. Transparent pricing. No calls. No waiting.
                Book paddle, football turf, and indoor table tennis in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/book"
                  className="rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-bold px-6 py-3.5 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Venue
                </Link>
                <Link
                  href="/venues"
                  className="rounded-[10px] border border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#141414] text-white font-medium px-6 py-3.5 text-sm transition-colors"
                >
                  Explore Venues
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols) - Clean full image, no nested cards or glow */}
            <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[440px] rounded-[16px] overflow-hidden border border-[#1E1E1E]">
              <Image
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop"
                alt="Equinox sports venue court"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="bg-[#111111] border-b border-[#1A1A1A] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">50+</p>
              <p className="text-xs uppercase tracking-wider text-[#A1A1A1] mt-1">Verified Venues</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">10,000+</p>
              <p className="text-xs uppercase tracking-wider text-[#A1A1A1] mt-1">Slots Booked</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F5B301]">100%</p>
              <p className="text-xs uppercase tracking-wider text-[#A1A1A1] mt-1">Live Availability</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">Instant</p>
              <p className="text-xs uppercase tracking-wider text-[#A1A1A1] mt-1">Confirmed Checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPORTS FILTER CHIPS */}
      <section id="sports" className="pt-16 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Featured Venues</h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Filter by sport and reserve slots directly with upfront pricing.
              </p>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Paddle", "Football", "Table Tennis"].map((sport) => {
                const isSelected = selectedSport === sport;
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => setSelectedSport(sport)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-[#F5B301] text-black"
                        : "border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#3A3A3A]"
                    }`}
                  >
                    {sport}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED VENUES (3-column grid) */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => {
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
                  className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="relative h-52 w-full">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-[#0B0B0B]/85 text-white text-[11px] font-medium px-2.5 py-1 rounded">
                      {venue.city}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{venue.name}</h3>
                      <p className="text-xs text-[#A1A1A1] mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F5B301]" />
                        {venue.address}
                      </p>
                    </div>

                    <div className="border-t border-[#1E1E1E] pt-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#A1A1A1]">Starting from</span>
                        <p className="text-lg font-bold text-white">
                          ₹{minPrice} <span className="text-xs font-normal text-[#A1A1A1]">/ hour</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#A1A1A1]">Availability</span>
                        <p className="text-xs font-semibold text-[#F5B301] flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {venueSlots.length ? `${venueSlots.length} Slots Open` : "Open Daily"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/book?venueId=${venue.id}`}
                      className="w-full text-center rounded-[10px] bg-[#1A1A1A] hover:bg-[#F5B301] text-white hover:text-black font-semibold py-3 text-xs uppercase tracking-wider transition-colors inline-block"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (Minimal 3-column steps, line icons, no clutter) */}
      <section className="py-20 border-t border-[#1A1A1A] bg-[#0E0E0E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">How It Works</h2>
            <p className="text-sm text-[#A1A1A1] mt-2">
              Three simple steps to lock your court time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg border border-[#2A2A2A] bg-[#121212] flex items-center justify-center font-bold text-[#F5B301]">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">Choose Venue</h3>
              <p className="text-sm text-[#A1A1A1] leading-relaxed">
                Browse verified venues near you in Mumbai or Bengaluru with court amenities and ratings.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg border border-[#2A2A2A] bg-[#121212] flex items-center justify-center font-bold text-[#F5B301]">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Pick Your Slot</h3>
              <p className="text-sm text-[#A1A1A1] leading-relaxed">
                Select from real-time morning or evening slots without double-booking or phone calls.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg border border-[#2A2A2A] bg-[#121212] flex items-center justify-center font-bold text-[#F5B301]">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Book Instantly</h3>
              <p className="text-sm text-[#A1A1A1] leading-relaxed">
                Confirm your slot in seconds. Receive immediate email and WhatsApp confirmation alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEMBERSHIP SECTION (Clean split layout) */}
      <section id="pricing" className="py-20 border-t border-[#1A1A1A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#F5B301]">
                For Regular Players
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Play More, Pay Less
              </h2>
              <p className="text-base text-[#A1A1A1] max-w-lg leading-relaxed">
                Get priority booking windows, discounted court pricing across all games, and access to members-only peak slots.
              </p>
              <div className="pt-2">
                <Link
                  href="/membership"
                  className="rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-semibold px-6 py-3.5 text-sm transition-colors inline-block"
                >
                  Apply for Membership
                </Link>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5 rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-8 space-y-6">
              <div className="border-b border-[#1E1E1E] pb-4">
                <span className="text-xs text-[#A1A1A1] uppercase font-semibold">Equinox Club Pass</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  ₹999 <span className="text-sm font-normal text-[#A1A1A1]">/ month</span>
                </p>
              </div>

              <div className="space-y-3 text-sm text-[#A1A1A1]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F5B301]" />
                  <span className="text-white">Priority booking 7 days in advance</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F5B301]" />
                  <span className="text-white">Up to 20% flat discount on all courts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F5B301]" />
                  <span className="text-white">Exclusive peak morning & evening slots</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F5B301]" />
                  <span className="text-white">Complimentary locker & equipment support</span>
                </div>
              </div>

              <Link
                href="/membership"
                className="w-full text-center rounded-[10px] border border-[#2A2A2A] hover:border-[#F5B301] hover:text-[#F5B301] text-white font-semibold py-3 text-xs uppercase tracking-wider transition-colors inline-block"
              >
                Get Membership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLEAN STRUCTURED FOOTER */}
      <footer className="border-t border-[#1A1A1A] bg-[#0B0B0B] py-14 text-sm text-[#A1A1A1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/venues" className="hover:text-white">Venues</Link></li>
                <li><Link href="/book" className="hover:text-white">Book Slots</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">Sports</p>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/book" className="hover:text-white">Paddle</Link></li>
                <li><Link href="/book" className="hover:text-white">Football Turf</Link></li>
                <li><Link href="/book" className="hover:text-white">Table Tennis</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</p>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/venues" className="hover:text-white">About Equinox</Link></li>
                <li><Link href="/community" className="hover:text-white">Player Lounge</Link></li>
                <li><Link href="/admin" className="hover:text-white">Partner / Admin</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Cancellation Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} Equinox Sports Inc. All rights reserved.</p>
            <p className="text-[#A1A1A1]">Next.js App Router · Firebase · PWA Ready</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
