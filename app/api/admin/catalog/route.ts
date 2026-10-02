import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCourt, createGame, createVenue, writeAuditLog } from "@/lib/store";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/api-auth";

const createVenueSchema = z.object({
  type: z.literal("venue"),
  name: z.string().min(2),
  city: z.string().min(2),
  timezone: z.string().min(2),
  currency: z.string().min(2),
  address: z.string().min(2),
  image: z.string().url(),
});

const createGameSchema = z.object({
  type: z.literal("game"),
  name: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url(),
  features: z.array(z.string()).min(1),
  venueIds: z.array(z.string()).min(1),
});

const createCourtSchema = z.object({
  type: z.literal("court"),
  venueId: z.string().min(1),
  gameId: z.string().min(1),
  name: z.string().min(2),
  image: z.string().url(),
  features: z.array(z.string()).min(1),
  basePrice: z.coerce.number().positive(),
  memberDiscountPercent: z.coerce.number().min(0).max(100),
});

const catalogSchema = z.discriminatedUnion("type", [
  createVenueSchema,
  createGameSchema,
  createCourtSchema,
]);

export async function POST(request: NextRequest) {
  const actor = getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden();

  const body = await request.json();
  const parsed = catalogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let created: unknown;

  if (parsed.data.type === "venue") {
    created = createVenue({
      ...parsed.data,
      active: true,
    });
  }

  if (parsed.data.type === "game") {
    created = createGame(parsed.data);
  }

  if (parsed.data.type === "court") {
    created = createCourt(parsed.data);
  }

  writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `catalog_${parsed.data.type}_created`,
    entity: parsed.data.type,
    entityId: JSON.stringify((created as { id?: string })?.id ?? "n/a"),
    details: `Created ${parsed.data.type}`,
  });

  return NextResponse.json({ ok: true, data: created });
}