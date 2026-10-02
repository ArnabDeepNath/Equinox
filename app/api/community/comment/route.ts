import { NextRequest, NextResponse } from "next/server";
import { commentSchema } from "@/lib/validators";
import { createComment, getCommunityPosts, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized("Sign in to comment");

  const body = await request.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Comment must be between 2 and 200 characters" }, { status: 400 });
  }

  const posts = await getCommunityPosts();
  const post = posts.find((item) => item.id === parsed.data.postId);
  if (!post) return notFound("Post not found");

  const comment = await createComment({
    postId: parsed.data.postId,
    userId: user.name || user.email,
    content: parsed.data.content,
  });

  await writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "community_comment_created",
    entity: "communityComments",
    entityId: comment.id,
    details: `${user.name} commented on discussion`,
  });

  return NextResponse.json({ ok: true, comment });
}
