import { NextRequest, NextResponse } from "next/server";
import { bookingQuoteSchema } from "@/lib/validators";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import { calculateBookingPrice, canBookSlot } from "@/lib/pricing";
import { getSlots } from "@/lib/store";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized("Please log in to calculate slot pricing");

  const body = await request.json();
  const parsed = bookingQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const allSlots = await getSlots();
  const slot = allSlots.find((item) => item.id === parsed.data.slotId);
  if (!slot) return notFound("Selected slot is not available");

  const allowed = canBookSlot(user.membershipStatus === "approved", slot.access);
  if (!allowed) {
    return NextResponse.json(
      { error: "This slot is restricted to approved Equinox members. Please request membership to unlock." },
      { status: 403 },
    );
  }

  const quote = calculateBookingPrice({
    courtId: parsed.data.courtId,
    slotId: parsed.data.slotId,
    isMember: user.membershipStatus === "approved",
  });

  return NextResponse.json({
    ok: true,
    quote,
  });
}
