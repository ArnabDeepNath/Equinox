import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "@/lib/validators";
import { createPost, writeAuditLog } from "@/lib/store";
import { getUserFromRequest, unauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized("Sign in to share with community");

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Post must be between 3 and 280 characters" }, { status: 400 });
  }

  const post = await createPost({
    userId: user.name || user.email,
    content: parsed.data.content,
  });

  await writeAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: "community_post_created",
    entity: "communityPosts",
    entityId: post.id,
    details: `${user.name} posted in community`,
  });

  return NextResponse.json({ ok: true, post });
}
