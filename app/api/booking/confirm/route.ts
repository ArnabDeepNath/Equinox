import { NextRequest, NextResponse } from "next/server";
import { bookingConfirmSchema } from "@/lib/validators";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import { calculateBookingPrice, canBookSlot } from "@/lib/pricing";
import { createBooking, createTransaction, store, writeAuditLog } from "@/lib/store";
import { sendBookingNotifications } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = bookingConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const court = store.courts.find((item) => item.id === parsed.data.courtId);
  const slot = store.slots.find((item) => item.id === parsed.data.slotId);
  const venue = store.venues.find((item) => item.id === parsed.data.venueId);

  if (!court || !slot || !venue) return notFound("Referenced entities not found");

  if (!canBookSlot(user.membershipStatus === "approved", slot.access)) {
    return NextResponse.json(
      { error: "This slot is only available for approved members" },
      { status: 403 },
    );
  }

  const quote = calculateBookingPrice({
    courtId: parsed.data.courtId,
    slotId: parsed.data.slotId,
    isMember: user.membershipStatus === "approved",
  });

  const booking = createBooking({
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

  const transaction = createTransaction({
    bookingId: booking.id,
    userId: user.id,
    amount: booking.total,
    currency: booking.currency,
    method: "mock",
    status: "success",
  });

  writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "booking_confirmed",
    entity: "bookings",
    entityId: booking.id,
    details: `Booking confirmed for ${court.name} (${slot.label})`,
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