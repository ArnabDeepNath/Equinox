import { NextRequest, NextResponse } from "next/server";
import { membershipRequestSchema } from "@/lib/validators";
import {
  createMembershipRequest,
  getMembershipRequests,
  upsertUser,
  writeAuditLog,
} from "@/lib/store";
import { getUserFromRequest, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized("Log in to request membership");

  const body = await request.json();
  const parsed = membershipRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid justification (10-300 characters)" }, { status: 400 });
  }

  const existingRequests = await getMembershipRequests();
  const existingPending = existingRequests.find(
    (item) => item.userId === user.id && item.status === "pending"
  );

  if (existingPending) {
    return NextResponse.json(
      { error: "You already have a pending membership application under review" },
      { status: 409 }
    );
  }

  const requestRecord = await createMembershipRequest({
    userId: user.id,
    reason: parsed.data.reason,
  });

  user.membershipStatus = "pending";
  await upsertUser(user);

  await writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "membership_requested",
    entity: "membershipRequests",
    entityId: requestRecord.id,
    details: `${user.name} submitted membership application: "${parsed.data.reason.slice(0, 50)}..."`,
  });

  return NextResponse.json({ ok: true, request: requestRecord });
}
