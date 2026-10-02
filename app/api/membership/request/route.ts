import { NextRequest, NextResponse } from "next/server";
import { membershipRequestSchema } from "@/lib/validators";
import { createMembershipRequest, store, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = membershipRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existingPending = store.membershipRequests.find(
    (item) => item.userId === user.id && item.status === "pending",
  );

  if (existingPending) {
    return NextResponse.json(
      { error: "You already have a pending membership request" },
      { status: 409 },
    );
  }

  const requestRecord = createMembershipRequest({
    userId: user.id,
    reason: parsed.data.reason,
  });

  user.membershipStatus = "pending";

  writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "membership_requested",
    entity: "membershipRequests",
    entityId: requestRecord.id,
    details: "User submitted membership request",
  });

  return NextResponse.json({ ok: true, request: requestRecord });
}