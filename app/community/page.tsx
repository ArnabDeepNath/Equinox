import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCommunityPosts, getCommunityComments } from "@/lib/store";
import { CommunityFeed } from "@/components/community-feed";

export default async function CommunityPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/community");
  }

  const [posts, comments] = await Promise.all([
    getCommunityPosts(),
    getCommunityComments(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Community Lounge
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Player Discussions & Matchups</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connect with paddle and football players, coordinate practice sessions, and share club reviews.
          </p>
        </div>

        <CommunityFeed user={user} posts={posts} comments={comments} />
      </div>
    </div>
  );
}
