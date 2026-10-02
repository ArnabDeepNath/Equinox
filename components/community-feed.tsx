"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppUser, CommunityComment, CommunityPost } from "@/lib/types";

interface CommunityFeedProps {
  user: AppUser;
  posts: CommunityPost[];
  comments: CommunityComment[];
}

export function CommunityFeed({ user, posts: initialPosts, comments: initialComments }: CommunityFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [commentByPost, setCommentByPost] = useState<Record<string, string>>({});
  const [loadingPost, setLoadingPost] = useState(false);

  const commentsByPost = useMemo(() => {
    return posts.reduce<Record<string, CommunityComment[]>>((acc, post) => {
      acc[post.id] = comments.filter((comment) => comment.postId === post.id);
      return acc;
    }, {});
  }, [posts, comments]);

  async function createPost() {
    if (!content.trim()) {
      toast.error("Write something before posting");
      return;
    }

    setLoadingPost(true);
    try {
      const response = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create post");

      setPosts((prev) => [data.post, ...prev]);
      setContent("");
      toast.success("Posted to community");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoadingPost(false);
    }
  }

  async function likePost(postId: string) {
    try {
      const response = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to like post");

      setPosts((prev) => prev.map((post) => (post.id === postId ? data.post : post)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  async function addComment(postId: string) {
    const content = commentByPost[postId]?.trim();
    if (!content) {
      toast.error("Write a comment first");
      return;
    }

    try {
      const response = await fetch("/api/community/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to comment");

      setComments((prev) => [data.comment, ...prev]);
      setCommentByPost((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Create a post</h3>
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={`Share your sports update, ${user.name.split(" ")[0]}...`}
          rows={3}
        />
        <Button disabled={loadingPost} onClick={createPost}>
          {loadingPost ? "Posting..." : "Post"}
        </Button>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">{post.userId}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{new Date(post.createdAt).toLocaleString()}</p>
          </div>

          <p className="text-sm">{post.content}</p>

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => likePost(post.id)}>
              Like ({post.likes})
            </Button>
          </div>

          <div className="space-y-2">
            {(commentsByPost[post.id] ?? []).map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-[var(--border)] bg-[#0f0f0f] px-3 py-2 text-sm"
              >
                <p className="mb-1 text-xs text-[var(--muted-foreground)]">{comment.userId}</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={commentByPost[post.id] ?? ""}
              onChange={(event) =>
                setCommentByPost((prev) => ({ ...prev, [post.id]: event.target.value }))
              }
              placeholder="Write a comment"
            />
            <Button variant="secondary" onClick={() => addComment(post.id)}>
              Reply
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}