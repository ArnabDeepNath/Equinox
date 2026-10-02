import { NextRequest, NextResponse } from "next/server";
import { membershipReviewSchema } from "@/lib/validators";
import { forbidden, getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import { store, writeAuditLog } from "@/lib/store";

export async function POST(request: NextRequest) {
  const actor = getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden();

  const body = await request.json();
  const parsed = membershipReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const membershipRequest = store.membershipRequests.find(
    (item) => item.id === parsed.data.requestId,
  );
  if (!membershipRequest) return notFound("Membership request not found");

  const targetUser = store.users.find((user) => user.id === membershipRequest.userId);
  if (!targetUser) return notFound("Target user not found");

  membershipRequest.status = parsed.data.decision;
  membershipRequest.reviewedBy = actor.id;
  membershipRequest.reviewedAt = new Date().toISOString();
  targetUser.membershipStatus = parsed.data.decision;

  writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `membership_${parsed.data.decision}`,
    entity: "membershipRequests",
    entityId: membershipRequest.id,
    details: `${actor.name} ${parsed.data.decision} membership for ${targetUser.name}`,
  });

  return NextResponse.json({
    ok: true,
    membershipRequest,
    user: targetUser,
  });
}