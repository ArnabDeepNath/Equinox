import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "@/lib/validators";
import { createPost, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const post = createPost({
    userId: user.id,
    content: parsed.data.content,
  });

  writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "community_post_created",
    entity: "communityPosts",
    entityId: post.id,
    details: "User created community post",
  });

  return NextResponse.json({ ok: true, post });
}