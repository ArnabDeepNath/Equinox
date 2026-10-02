import {
  AppUser,
  AuditLog,
  Booking,
  CommunityComment,
  CommunityPost,
  Court,
  Game,
  MembershipRequest,
  Slot,
  Transaction,
  Venue,
} from "@/lib/types";

const now = new Date().toISOString();

export const venues: Venue[] = [
  {
    id: "venue-1",
    name: "Equinox Beltola Complex",
    city: "Guwahati",
    timezone: "Asia/Kolkata",
    currency: "INR",
    address: "Near Beltola College, Guwahati",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    active: true,
  },
  {
    id: "venue-2",
    name: "Equinox Ganeshguri Complex",
    city: "Guwahati",
    timezone: "Asia/Kolkata",
    currency: "INR",
    address: "Near ABC Mall, GS Road, Guwahati",
    image:
      "https://images.unsplash.com/photo-1646649853703-7645147474ba?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
    active: true,
  },
];

export const games: Game[] = [
  {
    id: "game-1",
    name: "Paddle",
    description: "Professional paddle courts with evening lighting.",
    image:
      "https://images.unsplash.com/photo-1646649853703-7645147474ba?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
    features: ["LED lights", "Coach support", "Locker room"],
    venueIds: ["venue-1", "venue-2"],
  },
  {
    id: "game-2",
    name: "Football",
    description: "7v7 and 5v5 synthetic turf fields.",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1200&auto=format&fit=crop",
    features: ["Turf quality", "Flood lights", "Warm-up zone"],
    venueIds: ["venue-1"],
  },
  {
    id: "game-3",
    name: "Table Tennis",
    description: "Indoor climate-controlled TT arena.",
    image:
      "https://images.unsplash.com/photo-1646978567314-32cfd5a8854e?q=80&w=1255&auto=format&fit=crop&ixlib=rb-4.1.0",
    features: ["ITTF tables", "Pro paddles", "Practice wall"],
    venueIds: ["venue-2"],
  },
];

export const courts: Court[] = [
  {
    id: "court-1",
    venueId: "venue-1",
    gameId: "game-1",
    name: "Paddle Court A",
    image:
      "https://images.unsplash.com/photo-1646649851800-48dba35edc76?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
    features: ["4 players", "Outdoor", "Night play"],
    basePrice: 1200,
    memberDiscountPercent: 15,
  },
  {
    id: "court-2",
    venueId: "venue-1",
    gameId: "game-2",
    name: "Football Turf East",
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop",
    features: ["7v7", "Turf", "Scoreboard"],
    basePrice: 2500,
    memberDiscountPercent: 10,
  },
  {
    id: "court-3",
    venueId: "venue-2",
    gameId: "game-3",
    name: "TT Hall Premium",
    image:
      "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1200&auto=format&fit=crop",
    features: ["Indoor", "A/C", "2 tables"],
    basePrice: 800,
    memberDiscountPercent: 20,
  },
];

export const slots: Slot[] = [
  {
    id: "slot-1",
    courtId: "court-1",
    label: "06:00 - 07:00",
    startTime: "06:00",
    endTime: "07:00",
    access: "members",
    peakMultiplier: 1,
  },
  {
    id: "slot-2",
    courtId: "court-1",
    label: "08:00 - 09:00",
    startTime: "08:00",
    endTime: "09:00",
    access: "all",
    peakMultiplier: 1.1,
  },
  {
    id: "slot-3",
    courtId: "court-2",
    label: "19:00 - 20:00",
    startTime: "19:00",
    endTime: "20:00",
    access: "all",
    peakMultiplier: 1.2,
  },
  {
    id: "slot-4",
    courtId: "court-3",
    label: "07:00 - 08:00",
    startTime: "07:00",
    endTime: "08:00",
    access: "members",
    peakMultiplier: 1,
  },
];

export const users: AppUser[] = [
  {
    id: "admin-1",
    name: "Equinox Super Admin",
    email: "admin@equinoxsport.com",
    role: "admin",
    membershipStatus: "approved",
    favoriteGames: ["Paddle", "Football"],
    createdAt: now,
  },
  {
    id: "user-1",
    name: "Aarav Shah",
    email: "aarav@example.com",
    role: "user",
    membershipStatus: "approved",
    favoriteGames: ["Paddle"],
    createdAt: now,
  },
  {
    id: "user-2",
    name: "Meera Nair",
    email: "meera@example.com",
    role: "user",
    membershipStatus: "pending",
    favoriteGames: ["Table Tennis"],
    createdAt: now,
  },
];

export const bookings: Booking[] = [
  {
    id: "book-1",
    userId: "user-1",
    venueId: "venue-1",
    gameId: "game-1",
    courtId: "court-1",
    slotId: "slot-2",
    bookingDate: "2026-10-05",
    subtotal: 1320,
    discount: 198,
    total: 1122,
    currency: "INR",
    status: "confirmed",
    createdAt: now,
  },
];

export const transactions: Transaction[] = [
  {
    id: "txn-1",
    bookingId: "book-1",
    userId: "user-1",
    amount: 1122,
    currency: "INR",
    method: "mock",
    status: "success",
    createdAt: now,
  },
];

export const membershipRequests: MembershipRequest[] = [
  {
    id: "mr-1",
    userId: "user-2",
    reason: "I train daily and need early morning member slots in Guwahati.",
    status: "pending",
    requestedAt: now,
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    userId: "user-1",
    content: "Anyone up for a paddle doubles league this weekend in Guwahati?",
    likes: 5,
    createdAt: now,
  },
];

export const communityComments: CommunityComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    userId: "user-2",
    content: "I am in! Prefer Saturday evening at Beltola Complex.",
    createdAt: now,
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: "log-1",
    actorId: "admin-1",
    actorRole: "admin",
    action: "membership_approved",
    entity: "users",
    entityId: "user-1",
    details: "Approved membership request for Aarav Shah",
    createdAt: now,
  },
];
