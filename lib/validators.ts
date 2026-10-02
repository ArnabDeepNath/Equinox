import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  mode: z.enum(["google", "email"]),
});

export const bookingQuoteSchema = z.object({
  courtId: z.string().min(1),
  slotId: z.string().min(1),
  bookingDate: z.string().min(1),
});

export const bookingConfirmSchema = bookingQuoteSchema.extend({
  gameId: z.string().min(1),
  venueId: z.string().min(1),
});

export const membershipRequestSchema = z.object({
  reason: z.string().min(10).max(300),
});

export const postSchema = z.object({
  content: z.string().min(3).max(280),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(2).max(200),
});

export const membershipReviewSchema = z.object({
  requestId: z.string().min(1),
  decision: z.enum(["approved", "rejected"]),
});