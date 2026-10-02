import { NextRequest, NextResponse } from "next/server";
import { bookingQuoteSchema } from "@/lib/validators";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import { calculateBookingPrice, canBookSlot } from "@/lib/pricing";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = bookingQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const slot = store.slots.find((item) => item.id === parsed.data.slotId);
  if (!slot) return notFound("Slot not found");

  const allowed = canBookSlot(user.membershipStatus === "approved", slot.access);
  if (!allowed) {
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

  return NextResponse.json({
    ok: true,
    quote,
  });
}