import nodemailer from "nodemailer";
import { Booking, AppUser, Court, Slot, Venue } from "@/lib/types";

interface NotificationPayload {
  booking: Booking;
  user: AppUser;
  court: Court;
  slot: Slot;
  venue: Venue;
}

async function sendEmailConfirmation(payload: NotificationPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM ?? "bookings@equinoxsport.com";

  if (!host || !user || !pass) {
    console.info("[EMAIL_MOCK] SMTP not configured, skipping real email", payload.booking.id);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: payload.user.email,
    subject: `Booking Confirmed - ${payload.venue.name}`,
    html: `
      <h2>Your booking is confirmed ✅</h2>
      <p><strong>Venue:</strong> ${payload.venue.name}</p>
      <p><strong>Court:</strong> ${payload.court.name}</p>
      <p><strong>Slot:</strong> ${payload.slot.label}</p>
      <p><strong>Date:</strong> ${payload.booking.bookingDate}</p>
      <p><strong>Total:</strong> ${payload.booking.currency} ${payload.booking.total}</p>
    `,
  });
}

function sendWhatsAppMock(payload: NotificationPayload) {
  console.info("[WHATSAPP_MOCK]", {
    bookingId: payload.booking.id,
    to: payload.user.email,
    message: `Hi ${payload.user.name}, your booking for ${payload.court.name} at ${payload.slot.label} is confirmed.`,
  });
}

export async function sendBookingNotifications(payload: NotificationPayload) {
  await sendEmailConfirmation(payload);
  sendWhatsAppMock(payload);
}