import { NextRequest, NextResponse } from "next/server";
import { bookingConfirmSchema } from "@/lib/validators";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import { calculateBookingPrice, canBookSlot } from "@/lib/pricing";
import {
  getCourts,
  getSlots,
  getVenues,
  createBooking,
  createTransaction,
  writeAuditLog,
} from "@/lib/store";
import { sendBookingNotifications } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized("Please log in to complete booking");

  const body = await request.json();
  const parsed = bookingConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking request parameters" }, { status: 400 });
  }

  const [allCourts, allSlots, allVenues] = await Promise.all([
    getCourts(),
    getSlots(),
    getVenues(),
  ]);

  const court = allCourts.find((item) => item.id === parsed.data.courtId);
  const slot = allSlots.find((item) => item.id === parsed.data.slotId);
  const venue = allVenues.find((item) => item.id === parsed.data.venueId);

  if (!court || !slot || !venue) {
    return notFound("The court, slot, or venue specified could not be found");
  }

  if (!canBookSlot(user.membershipStatus === "approved", slot.access)) {
    return NextResponse.json(
      { error: "This slot is exclusive to approved Equinox members" },
      { status: 403 },
    );
  }

  const quote = calculateBookingPrice({
    courtId: parsed.data.courtId,
    slotId: parsed.data.slotId,
    isMember: user.membershipStatus === "approved",
  });

  const booking = await createBooking({
    userId: user.id,
    venueId: parsed.data.venueId,
    gameId: parsed.data.gameId,
    courtId: parsed.data.courtId,
    slotId: parsed.data.slotId,
    bookingDate: parsed.data.bookingDate,
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    currency: quote.currency,
    status: "confirmed",
  });

  const transaction = await createTransaction({
    bookingId: booking.id,
    userId: user.id,
    amount: booking.total,
    currency: booking.currency,
    method: "mock",
    status: "success",
  });

  await writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "booking_confirmed",
    entity: "bookings",
    entityId: booking.id,
    details: `Confirmed booking for ${court.name} at ${venue.name} (${slot.label})`,
  });

  await sendBookingNotifications({
    booking,
    user,
    court,
    slot,
    venue,
  });

  return NextResponse.json({ ok: true, booking, transaction });
}
