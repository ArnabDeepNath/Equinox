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
    <div className="min-h-screen bg-[#0B0B0B] text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-[#F5B301]">
            Player Network
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">Community Discussions</h1>
          <p className="text-sm text-[#A1A1A1] mt-1">
            Connect with paddle and football players, coordinate practice sessions, and share club reviews.
          </p>
        </div>

        <CommunityFeed user={user} posts={posts} comments={comments} />
      </div>
    </div>
  );
}
