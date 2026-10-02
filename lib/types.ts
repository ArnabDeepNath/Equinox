export type UserRole = "admin" | "user";

export type MembershipStatus = "none" | "pending" | "approved" | "rejected";

export type SlotAccess = "all" | "members";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type TransactionStatus = "pending" | "success" | "failed";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
  favoriteGames: string[];
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  timezone: string;
  currency: string;
  address: string;
  image: string;
  active: boolean;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  venueIds: string[];
}

export interface Court {
  id: string;
  venueId: string;
  gameId: string;
  name: string;
  image: string;
  features: string[];
  basePrice: number;
  memberDiscountPercent: number;
}

export interface Slot {
  id: string;
  courtId: string;
  label: string;
  startTime: string;
  endTime: string;
  access: SlotAccess;
  peakMultiplier: number;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  gameId: string;
  courtId: string;
  slotId: string;
  bookingDate: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  method: "mock";
  status: TransactionStatus;
  createdAt: string;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  reason: string;
  status: MembershipStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  createdAt: string;
}