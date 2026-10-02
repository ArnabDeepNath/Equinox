import {
  getBookings,
  getMembershipRequests,
  getTransactions,
  getVenues,
  getCommunityPosts,
} from "@/lib/store";

export async function getAdminMetrics() {
  const [bookings, membershipRequests, transactions, venues, posts] = await Promise.all([
    getBookings(),
    getMembershipRequests(),
    getTransactions(),
    getVenues(),
    getCommunityPosts(),
  ]);

  const confirmedBookings = bookings.filter((item) => item.status === "confirmed");
  const revenue = confirmedBookings.reduce((sum, item) => sum + item.total, 0);

  return {
    totalUsers: 14 + membershipRequests.length,
    totalVenues: venues.length,
    totalBookings: bookings.length,
    confirmedBookings: confirmedBookings.length,
    revenue,
    pendingMemberships: membershipRequests.filter((r) => r.status === "pending").length,
    communityPosts: posts.length,
    transactions: transactions.length,
  };
}
