import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { forbidden, getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import {
  getBookings,
  getUserById,
  getCourts,
  getSlots,
  getVenues,
  updateBookingStatus,
  writeAuditLog,
} from "@/lib/store";
import { sendBookingDecisionEmail } from "@/lib/notifications";

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden("Administrator rights required");

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking decision payload" }, { status: 400 });
  }

  const { bookingId, decision, reason } = parsed.data;

  const [bookings, courts, slots, venues] = await Promise.all([
    getBookings(),
    getCourts(),
    getSlots(),
    getVenues(),
  ]);

  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return notFound("Booking request not found");

  const newStatus = decision === "approved" ? "confirmed" : "cancelled";
  await updateBookingStatus(bookingId, newStatus);
  booking.status = newStatus;

  const user = await getUserById(booking.userId);
  const court = courts.find((c) => c.id === booking.courtId);
  const slot = slots.find((s) => s.id === booking.slotId);
  const venue = venues.find((v) => v.id === booking.venueId);

  await writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `booking_${decision}`,
    entity: "bookings",
    entityId: booking.id,
    details: `Admin ${actor.name} ${decision} booking ${booking.id} (${court?.name || ""} on ${booking.bookingDate})${reason ? `: "${reason}"` : ""}`,
  });

  if (user && court && slot && venue) {
    await sendBookingDecisionEmail(
      {
        booking,
        user,
        court,
        slot,
        venue,
      },
      decision,
      reason
    );
  }

  return NextResponse.json({ ok: true, booking });
}
