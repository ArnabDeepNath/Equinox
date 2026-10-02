import { getCurrentUser } from "@/lib/session";
import { getVenues, getGames, getCourts, getSlots } from "@/lib/store";
import { HomeClientView } from "@/components/home-client-view";

export default async function Home() {
  const [user, venues, games, courts, slots] = await Promise.all([
    getCurrentUser(),
    getVenues(),
    getGames(),
    getCourts(),
    getSlots(),
  ]);

  return (
    <HomeClientView
      user={user}
      venues={venues}
      games={games}
      courts={courts}
      slots={slots}
    />
  );
}
