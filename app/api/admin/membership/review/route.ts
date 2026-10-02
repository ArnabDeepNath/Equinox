import { NextRequest, NextResponse } from "next/server";
import { membershipReviewSchema } from "@/lib/validators";
import { forbidden, getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";
import {
  getMembershipRequests,
  getUserById,
  updateMembershipRequestStatus,
  upsertUser,
  writeAuditLog,
} from "@/lib/store";

export async function POST(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) return unauthorized();
  if (actor.role !== "admin") return forbidden("Administrator rights required");

  const body = await request.json();
  const parsed = membershipReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review parameters" }, { status: 400 });
  }

  const allRequests = await getMembershipRequests();
  const membershipRequest = allRequests.find((item) => item.id === parsed.data.requestId);
  if (!membershipRequest) return notFound("Membership application not found");

  const targetUser = await getUserById(membershipRequest.userId);
  if (!targetUser) return notFound("Applicant user account not found");

  await updateMembershipRequestStatus(membershipRequest.id, parsed.data.decision, actor.id);

  targetUser.membershipStatus = parsed.data.decision;
  await upsertUser(targetUser);

  await writeAuditLog({
    actorId: actor.id,
    actorRole: actor.role,
    action: `membership_${parsed.data.decision}`,
    entity: "membershipRequests",
    entityId: membershipRequest.id,
    details: `${actor.name} ${parsed.data.decision} membership for ${targetUser.name} (${targetUser.email})`,
  });

  return NextResponse.json({
    ok: true,
    user: targetUser,
  });
}
