"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  MessageSquare,
  Heart,
  Send,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { AppUser, CommunityComment, CommunityPost } from "@/lib/types";

interface CommunityFeedProps {
  user: AppUser;
  posts: CommunityPost[];
  comments: CommunityComment[];
}

export function CommunityFeed({
  user,
  posts: initialPosts,
  comments: initialComments,
}: CommunityFeedProps) {
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
      toast.error("Please enter a discussion topic");
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
      if (!response.ok) throw new Error(data.error ?? "Failed to publish post");

      setPosts((prev) => [data.post, ...prev]);
      setContent("");
      toast.success("Published to club lounge!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error publishing post");
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
      toast.error(error instanceof Error ? error.message : "Error liking post");
    }
  }

  async function addComment(postId: string) {
    const text = commentByPost[postId]?.trim();
    if (!text) {
      toast.error("Enter a comment message first");
      return;
    }

    try {
      const response = await fetch("/api/community/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to comment");

      setComments((prev) => [...prev, data.comment]);
      setCommentByPost((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Replied to thread");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error submitting reply");
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">Share match openings, practice invites, or club banter</p>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Looking for paddle doubles partners this Saturday at BKC? Speak up...`}
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-gray-500">Visible to all Equinox players</span>
          <button
            type="button"
            disabled={loadingPost}
            onClick={createPost}
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold px-6 py-2.5 text-sm transition hover:brightness-110 shadow-md shadow-orange-500/20 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            {loadingPost ? "Posting..." : "Share with Club"}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          const postComments = commentsByPost[post.id] || [];

          return (
            <div
              key={post.id}
              className="rounded-3xl border border-white/10 bg-neutral-900/40 p-6 space-y-4 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-amber-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{post.userId}</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-gray-300 hover:text-white transition"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                  <span>{post.likes}</span>
                </button>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed pl-1">
                {post.content}
              </p>

              {/* Comments Section */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {postComments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-neutral-950/60 border border-white/5 p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="font-bold text-gray-300">{c.userId}</span>
                      <span className="text-[10px]">{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-200">{c.content}</p>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentByPost[post.id] || ""}
                    onChange={(e) =>
                      setCommentByPost((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Write a reply or join the team..."
                    className="flex-1 rounded-full border border-white/10 bg-neutral-950 px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => addComment(post.id)}
                    className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2 text-xs font-semibold text-white transition"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
