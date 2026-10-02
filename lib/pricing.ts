import { courts, slots, venues } from "@/lib/mock-data";

interface PriceInput {
  courtId: string;
  slotId: string;
  isMember: boolean;
}

export function calculateBookingPrice({ courtId, slotId, isMember }: PriceInput) {
  const court = courts.find((item) => item.id === courtId);
  const slot = slots.find((item) => item.id === slotId);

  if (!court || !slot) {
    throw new Error("Invalid pricing references");
  }

  const venue = venues.find((item) => item.id === court.venueId);
  const currency = venue?.currency ?? "INR";
  const subtotal = Math.round(court.basePrice * slot.peakMultiplier);
  const discount = isMember
    ? Math.round((subtotal * court.memberDiscountPercent) / 100)
    : 0;
  const total = subtotal - discount;

  return {
    currency,
    subtotal,
    discount,
    total,
  };
}

export function canBookSlot(isMember: boolean, slotAccess: "all" | "members") {
  if (slotAccess === "all") {
    return true;
  }

  return isMember;
}