import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createCourt,
  createGame,
  createVenue,
  updateVenue,
  deleteVenue,
  updateGame,
  deleteGame,
  updateCourt,
  deleteCourt,
  writeAuditLog,
} from "@/lib/store";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/api-auth";

const venueSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  timezone: z.string().min(2),
  currency: z.string().min(2),
  address: z.string().min(2),
  image: z.string().url(),
});

const gameSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url(),
  features: z.array(z.string()).min(1),
  venueIds: z.array(z.string()).min(1),
});

const courtSchema = z.object({
  venueId: z.string().min(1),
  gameId: z.string().min(1),
  name: z.string().min(2),
  image: z.string().url(),
  features: z.array(z.string()).min(1),
  basePrice: z.coerce.number().positive(),
  memberDiscountPercent: z.coerce.number().min(0).max(100),
});

export async function POST(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden();

  const body = await request.json();
  const { type, ...data } = body;

  let created: unknown;

  if (type === "venue") {
    const parsed = venueSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: "Invalid venue data" }, { status: 400 });
    created = await createVenue({ ...parsed.data, active: true });
  } else if (type === "game") {
    const parsed = gameSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
    created = await createGame(parsed.data);
  } else if (type === "court") {
    const parsed = courtSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: "Invalid court data" }, { status: 400 });
    created = await createCourt(parsed.data);
  } else {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  await writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `catalog_${type}_created`,
    entity: type,
    entityId: JSON.stringify((created as { id?: string })?.id ?? "n/a"),
    details: `Admin ${actor.name} created new ${type}`,
  });

  return NextResponse.json({ ok: true, data: created });
}

export async function PUT(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden();

  const body = await request.json();
  const { type, id: entityId, ...data } = body;

  if (!entityId || !type) {
    return NextResponse.json({ error: "ID and type are required for updating" }, { status: 400 });
  }

  if (type === "venue") {
    await updateVenue(entityId, data);
  } else if (type === "game") {
    await updateGame(entityId, data);
  } else if (type === "court") {
    await updateCourt(entityId, data);
  } else {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  await writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `catalog_${type}_updated`,
    entity: type,
    entityId,
    details: `Admin ${actor.name} updated ${type} (${entityId})`,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden();

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const entityId = searchParams.get("id");

  if (!entityId || !type) {
    return NextResponse.json({ error: "Entity ID and type are required" }, { status: 400 });
  }

  if (type === "venue") {
    await deleteVenue(entityId);
  } else if (type === "game") {
    await deleteGame(entityId);
  } else if (type === "court") {
    await deleteCourt(entityId);
  } else {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  await writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `catalog_${type}_deleted`,
    entity: type,
    entityId,
    details: `Admin ${actor.name} deleted ${type} (${entityId})`,
  });

  return NextResponse.json({ ok: true });
}
