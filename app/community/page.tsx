import { redirect } from "next/navigation";
import { SectionTitle } from "@/components/section-title";
import { CommunityFeed } from "@/components/community-feed";
import { getCurrentUser } from "@/lib/session";
import { store } from "@/lib/store";

export default async function CommunityPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Sports Community"
        subtitle="Discuss practice plans, matches, and your game preferences with other users."
      />
      <CommunityFeed user={user} posts={store.communityPosts} comments={store.communityComments} />
    </div>
  );
}