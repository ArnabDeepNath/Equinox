import { NextRequest, NextResponse } from "next/server";
import { commentSchema } from "@/lib/validators";
import { createComment, store, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const post = store.communityPosts.find((item) => item.id === parsed.data.postId);
  if (!post) return notFound("Post not found");

  const comment = createComment({
    postId: parsed.data.postId,
    userId: user.id,
    content: parsed.data.content,
  });

  writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "community_comment_created",
    entity: "communityComments",
    entityId: comment.id,
    details: "User commented on post",
  });

  return NextResponse.json({ ok: true, comment });
}