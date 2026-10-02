"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Heart, Send, User } from "lucide-react";
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
      toast.success("Published to community");
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
      <div className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center font-bold text-[#F5B301] text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{user.name}</p>
            <p className="text-xs text-[#A1A1A1]">Share match openings, practice invites, or equipment tips</p>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Looking for paddle doubles partners this Saturday at BKC? Speak up..."
          rows={3}
          className="w-full rounded-[10px] border border-[#2A2A2A] bg-[#0E0E0E] p-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#F5B301]"
        />

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={loadingPost}
            onClick={createPost}
            className="rounded-[10px] bg-[#F5B301] hover:bg-[#e0a400] text-black font-semibold px-5 py-2.5 text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {loadingPost ? "Posting..." : "Post to Community"}
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
              className="rounded-[16px] bg-[#121212] border border-[#1E1E1E] p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-[#F5B301]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{post.userId}</p>
                    <p className="text-[10px] text-[#A1A1A1]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="inline-flex items-center gap-1 rounded-[8px] border border-[#2A2A2A] bg-[#0E0E0E] px-2.5 py-1 text-xs text-[#A1A1A1] hover:text-white transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{post.likes}</span>
                </button>
              </div>

              <p className="text-sm text-[#ddd] leading-relaxed">
                {post.content}
              </p>

              {/* Comments Section */}
              <div className="space-y-2 pt-3 border-t border-[#1E1E1E]">
                {postComments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-[8px] bg-[#0E0E0E] p-3 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#A1A1A1]">
                      <span className="font-medium text-white">{c.userId}</span>
                      <span className="text-[10px]">{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[#ccc]">{c.content}</p>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentByPost[post.id] || ""}
                    onChange={(e) =>
                      setCommentByPost((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Write a reply..."
                    className="flex-1 rounded-[8px] border border-[#2A2A2A] bg-[#0E0E0E] px-3.5 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#F5B301]"
                  />
                  <button
                    type="button"
                    onClick={() => addComment(post.id)}
                    className="rounded-[8px] border border-[#2A2A2A] hover:border-[#3A3A3A] px-4 py-2 text-xs font-medium text-white transition-colors"
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
