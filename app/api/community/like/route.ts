import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addLike, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, notFound, unauthorized } from "@/lib/api-auth";

const likeSchema = z.object({
  postId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = likeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const post = addLike(parsed.data.postId);
  if (!post) return notFound("Post not found");

  writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "community_post_liked",
    entity: "communityPosts",
    entityId: post.id,
    details: "User liked a post",
  });

  return NextResponse.json({ ok: true, post });
}