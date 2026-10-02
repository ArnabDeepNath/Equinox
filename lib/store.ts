import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  venues as defaultVenues,
  games as defaultGames,
  courts as defaultCourts,
  slots as defaultSlots,
  users as defaultUsers,
} from "@/lib/mock-data";
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

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

let hasSeeded = false;

export async function ensureCollectionsSeeded() {
  if (hasSeeded) return;
  try {
    const venuesSnapshot = await getDocs(collection(db, "venues"));
    if (venuesSnapshot.empty) {
      for (const v of defaultVenues) await setDoc(doc(db, "venues", v.id), v);
      for (const g of defaultGames) await setDoc(doc(db, "games", g.id), g);
      for (const c of defaultCourts) await setDoc(doc(db, "courts", c.id), c);
      for (const s of defaultSlots) await setDoc(doc(db, "slots", s.id), s);
      for (const u of defaultUsers) await setDoc(doc(db, "users", u.id), u);
    }
    hasSeeded = true;
  } catch (err) {
    console.warn("Seeding notice:", err);
  }
}

export async function getUserById(userId: string): Promise<AppUser | null> {
  try {
    const d = await getDoc(doc(db, "users", userId));
    if (d.exists()) return { id: d.id, ...d.data() } as AppUser;
  } catch (err) {
    console.error("getUserById err:", err);
  }
  return defaultUsers.find((u) => u.id === userId) ?? null;
}

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  try {
    const q = query(collection(db, "users"), where("email", "==", email), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as AppUser;
    }
  } catch (err) {
    console.error("getUserByEmail err:", err);
  }
  return defaultUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function upsertUser(user: AppUser): Promise<AppUser> {
  try {
    await setDoc(doc(db, "users", user.id), { ...user, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error("upsertUser err:", err);
  }
  return user;
}

// ----------------- Venues -----------------
export async function getVenues(): Promise<Venue[]> {
  try {
    await ensureCollectionsSeeded();
    const snap = await getDocs(collection(db, "venues"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Venue));
  } catch (err) {
    console.error("getVenues err:", err);
  }
  return defaultVenues;
}

export async function createVenue(entry: Omit<Venue, "id">): Promise<Venue> {
  const newId = id("venue");
  const venue: Venue = { ...entry, id: newId };
  try {
    await setDoc(doc(db, "venues", newId), venue);
  } catch (err) {
    console.error("createVenue err:", err);
  }
  return venue;
}

export async function updateVenue(venueId: string, entry: Partial<Omit<Venue, "id">>): Promise<void> {
  try {
    await updateDoc(doc(db, "venues", venueId), entry);
  } catch (err) {
    console.error("updateVenue err:", err);
    throw err;
  }
}

export async function deleteVenue(venueId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "venues", venueId));
  } catch (err) {
    console.error("deleteVenue err:", err);
    throw err;
  }
}

// ----------------- Games -----------------
export async function getGames(): Promise<Game[]> {
  try {
    await ensureCollectionsSeeded();
    const snap = await getDocs(collection(db, "games"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
  } catch (err) {
    console.error("getGames err:", err);
  }
  return defaultGames;
}

export async function createGame(entry: Omit<Game, "id">): Promise<Game> {
  const newId = id("game");
  const game: Game = { ...entry, id: newId };
  try {
    await setDoc(doc(db, "games", newId), game);
  } catch (err) {
    console.error("createGame err:", err);
  }
  return game;
}

export async function updateGame(gameId: string, entry: Partial<Omit<Game, "id">>): Promise<void> {
  try {
    await updateDoc(doc(db, "games", gameId), entry);
  } catch (err) {
    console.error("updateGame err:", err);
    throw err;
  }
}

export async function deleteGame(gameId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "games", gameId));
  } catch (err) {
    console.error("deleteGame err:", err);
    throw err;
  }
}

// ----------------- Courts -----------------
export async function getCourts(): Promise<Court[]> {
  try {
    await ensureCollectionsSeeded();
    const snap = await getDocs(collection(db, "courts"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Court));
  } catch (err) {
    console.error("getCourts err:", err);
  }
  return defaultCourts;
}

export async function createCourt(entry: Omit<Court, "id">): Promise<Court> {
  const newId = id("court");
  const court: Court = { ...entry, id: newId };
  try {
    await setDoc(doc(db, "courts", newId), court);
  } catch (err) {
    console.error("createCourt err:", err);
  }
  return court;
}

export async function updateCourt(courtId: string, entry: Partial<Omit<Court, "id">>): Promise<void> {
  try {
    await updateDoc(doc(db, "courts", courtId), entry);
  } catch (err) {
    console.error("updateCourt err:", err);
    throw err;
  }
}

export async function deleteCourt(courtId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "courts", courtId));
  } catch (err) {
    console.error("deleteCourt err:", err);
    throw err;
  }
}

// ----------------- Slots -----------------
export async function getSlots(): Promise<Slot[]> {
  try {
    await ensureCollectionsSeeded();
    const snap = await getDocs(collection(db, "slots"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Slot));
  } catch (err) {
    console.error("getSlots err:", err);
  }
  return defaultSlots;
}

// ----------------- Bookings -----------------
export async function getBookings(): Promise<Booking[]> {
  try {
    const snap = await getDocs(collection(db, "bookings"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.error("getBookings err:", err);
  }
  return [];
}

export async function createBooking(entry: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  const newId = id("book");
  const booking: Booking = { ...entry, id: newId, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, "bookings", newId), booking);
  } catch (err) {
    console.error("createBooking err:", err);
  }
  return booking;
}

// ----------------- Transactions -----------------
export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled" | "pending"
): Promise<void> {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("updateBookingStatus err:", err);
    throw err;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const snap = await getDocs(collection(db, "transactions"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
  } catch (err) {
    console.error("getTransactions err:", err);
  }
  return [];
}

export async function createTransaction(entry: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  const newId = id("txn");
  const transaction: Transaction = { ...entry, id: newId, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, "transactions", newId), transaction);
  } catch (err) {
    console.error("createTransaction err:", err);
  }
  return transaction;
}

// ----------------- Membership Requests -----------------
export async function getMembershipRequests(): Promise<MembershipRequest[]> {
  try {
    const snap = await getDocs(collection(db, "membershipRequests"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MembershipRequest));
  } catch (err) {
    console.error("getMembershipRequests err:", err);
  }
  return [];
}

export async function createMembershipRequest(entry: Omit<MembershipRequest, "id" | "requestedAt" | "status">): Promise<MembershipRequest> {
  const newId = id("mr");
  const request: MembershipRequest = { ...entry, id: newId, requestedAt: new Date().toISOString(), status: "pending" };
  try {
    await setDoc(doc(db, "membershipRequests", newId), request);
  } catch (err) {
    console.error("createMembershipRequest err:", err);
  }
  return request;
}

export async function updateMembershipRequestStatus(requestId: string, status: "approved" | "rejected", reviewedBy: string) {
  try {
    await updateDoc(doc(db, "membershipRequests", requestId), {
      status,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("updateMembershipRequestStatus err:", err);
  }
}

// ----------------- Community -----------------
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const snap = await getDocs(collection(db, "communityPosts"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityPost));
  } catch (err) {
    console.error("getCommunityPosts err:", err);
  }
  return [
    {
      id: "post-1",
      userId: "aarav@example.com",
      content: "Anyone up for a paddle doubles league this weekend?",
      likes: 6,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function createPost(entry: Omit<CommunityPost, "id" | "createdAt" | "likes">): Promise<CommunityPost> {
  const newId = id("post");
  const post: CommunityPost = { ...entry, id: newId, likes: 0, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, "communityPosts", newId), post);
  } catch (err) {
    console.error("createPost err:", err);
  }
  return post;
}

export async function getCommunityComments(): Promise<CommunityComment[]> {
  try {
    const snap = await getDocs(collection(db, "communityComments"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityComment));
  } catch (err) {
    console.error("getCommunityComments err:", err);
  }
  return [
    {
      id: "comment-1",
      postId: "post-1",
      userId: "meera@example.com",
      content: "I am in! Prefer Saturday evening in Guwahati.",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function createComment(entry: Omit<CommunityComment, "id" | "createdAt">): Promise<CommunityComment> {
  const newId = id("comment");
  const comment: CommunityComment = { ...entry, id: newId, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, "communityComments", newId), comment);
  } catch (err) {
    console.error("createComment err:", err);
  }
  return comment;
}

export async function addLike(postId: string): Promise<CommunityPost | null> {
  try {
    const postRef = doc(db, "communityPosts", postId);
    const snap = await getDoc(postRef);
    if (snap.exists()) {
      const currentLikes = (snap.data().likes || 0) + 1;
      await updateDoc(postRef, { likes: currentLikes });
      return { id: snap.id, ...snap.data(), likes: currentLikes } as CommunityPost;
    }
  } catch (err) {
    console.error("addLike err:", err);
  }
  return null;
}

// ----------------- Audit Logs -----------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const snap = await getDocs(collection(db, "auditLogs"));
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLog));
  } catch (err) {
    console.error("getAuditLogs err:", err);
  }
  return [
    {
      id: "log-init",
      actorId: "admin@equinoxsport.com",
      actorRole: "admin",
      action: "system_initialized",
      entity: "system",
      entityId: "equinox-24170",
      details: "Firestore connected with multi-venue configuration",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function writeAuditLog(entry: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
  const newId = id("log");
  const log: AuditLog = { ...entry, id: newId, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, "auditLogs", newId), log);
  } catch (err) {
    console.error("writeAuditLog err:", err);
  }
  return log;
}
