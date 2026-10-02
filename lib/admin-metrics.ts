import { store } from "@/lib/store";

export function getAdminMetrics() {
  const confirmedBookings = store.bookings.filter((item) => item.status === "confirmed");
  const revenue = confirmedBookings.reduce((sum, item) => sum + item.total, 0);

  return {
    totalUsers: store.users.length,
    totalVenues: store.venues.length,
    totalBookings: store.bookings.length,
    confirmedBookings: confirmedBookings.length,
    revenue,
    pendingMemberships: store.membershipRequests.filter((r) => r.status === "pending")
      .length,
    communityPosts: store.communityPosts.length,
    transactions: store.transactions.length,
  };
}