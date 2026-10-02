import {
  auditLogs,
  bookings,
  communityComments,
  communityPosts,
  courts,
  games,
  membershipRequests,
  slots,
  transactions,
  users,
  venues,
} from "@/lib/mock-data";
import {
  AuditLog,
  Booking,
  CommunityComment,
  CommunityPost,
  Court,
  Game,
  MembershipRequest,
  Transaction,
  Venue,
} from "@/lib/types";

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const store = {
  users,
  venues,
  games,
  courts,
  slots,
  bookings,
  transactions,
  membershipRequests,
  communityPosts,
  communityComments,
  auditLogs,
};

export function createBooking(entry: Omit<Booking, "id" | "createdAt">): Booking {
  const booking: Booking = {
    ...entry,
    id: id("book"),
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(booking);
  return booking;
}

export function createTransaction(
  entry: Omit<Transaction, "id" | "createdAt">,
): Transaction {
  const transaction: Transaction = {
    ...entry,
    id: id("txn"),
    createdAt: new Date().toISOString(),
  };
  store.transactions.unshift(transaction);
  return transaction;
}

export function createMembershipRequest(
  entry: Omit<MembershipRequest, "id" | "requestedAt" | "status">,
): MembershipRequest {
  const request: MembershipRequest = {
    ...entry,
    id: id("mr"),
    requestedAt: new Date().toISOString(),
    status: "pending",
  };
  store.membershipRequests.unshift(request);
  return request;
}

export function createPost(entry: Omit<CommunityPost, "id" | "createdAt" | "likes">) {
  const post: CommunityPost = {
    ...entry,
    id: id("post"),
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  store.communityPosts.unshift(post);
  return post;
}

export function createComment(
  entry: Omit<CommunityComment, "id" | "createdAt">,
): CommunityComment {
  const comment: CommunityComment = {
    ...entry,
    id: id("comment"),
    createdAt: new Date().toISOString(),
  };
  store.communityComments.unshift(comment);
  return comment;
}

export function addLike(postId: string) {
  const post = store.communityPosts.find((item) => item.id === postId);
  if (post) {
    post.likes += 1;
  }
  return post;
}

export function writeAuditLog(entry: Omit<AuditLog, "id" | "createdAt">): AuditLog {
  const log: AuditLog = {
    ...entry,
    id: id("log"),
    createdAt: new Date().toISOString(),
  };
  store.auditLogs.unshift(log);
  return log;
}

export function createVenue(entry: Omit<Venue, "id">): Venue {
  const venue: Venue = {
    ...entry,
    id: id("venue"),
  };
  store.venues.unshift(venue);
  return venue;
}

export function createGame(entry: Omit<Game, "id">): Game {
  const game: Game = {
    ...entry,
    id: id("game"),
  };
  store.games.unshift(game);
  return game;
}

export function createCourt(entry: Omit<Court, "id">): Court {
  const court: Court = {
    ...entry,
    id: id("court"),
  };
  store.courts.unshift(court);
  return court;
}