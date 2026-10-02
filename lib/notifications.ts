import nodemailer from "nodemailer";
import { Booking, AppUser, Court, Slot, Venue } from "@/lib/types";

interface NotificationPayload {
  booking: Booking;
  user: AppUser;
  court: Court;
  slot: Slot;
  venue: Venue;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBookingSubmittedEmail(payload: NotificationPayload) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "bookings@equinoxsport.com";

  if (!transporter) {
    console.info("[EMAIL] SMTP credentials not set, logging booking submission email mock for:", payload.user.email);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Equinox Sports" <${from}>`,
      to: payload.user.email,
      subject: `Booking Request Received (Pending Review) - ${payload.venue.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #222;">
          <h2 style="color: #F5B301; margin-top: 0;">Booking Received & Pending Approval</h2>
          <p style="color: #a1a1a1; font-size: 14px;">Hi ${payload.user.name}, we have received your booking and payment. Your reservation is currently under review by the venue administration.</p>
          
          <div style="background-color: #141414; border: 1px solid #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 6px 0; color: #ddd;"><strong>Booking ID:</strong> <span style="color: #F5B301;">${payload.booking.id}</span></p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Venue:</strong> ${payload.venue.name}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Court:</strong> ${payload.court.name}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Match Date:</strong> ${payload.booking.bookingDate}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Slot Window:</strong> ${payload.slot.label}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Total Amount:</strong> ${payload.booking.currency} ${payload.booking.total}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Current Status:</strong> <span style="background: rgba(245, 179, 1, 0.2); color: #F5B301; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">PENDING ADMIN APPROVAL</span></p>
          </div>

          <p style="color: #a1a1a1; font-size: 13px;">You will receive an update as soon as the club administrator approves or rejects your request.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="color: #666; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Equinox Sports Inc. Multi-Venue Sports Platform.</p>
        </div>
      `,
    });
    console.log("[EMAIL] Booking submitted notification sent to:", payload.user.email);
  } catch (err) {
    console.error("[EMAIL_ERROR] Failed to send booking submitted email:", err);
  }
}

export async function sendBookingDecisionEmail(
  payload: NotificationPayload,
  decision: "approved" | "rejected",
  reason?: string
) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "bookings@equinoxsport.com";

  if (!transporter) {
    console.info(`[EMAIL] SMTP credentials not set, logging booking ${decision} email mock for:`, payload.user.email);
    return;
  }

  const isApproved = decision === "approved";
  const subject = isApproved
    ? `Booking Confirmed ✅ - ${payload.court.name} at ${payload.venue.name}`
    : `Booking Request Update ❌ - ${payload.venue.name}`;

  const headerColor = isApproved ? "#10B981" : "#EF4444";
  const statusBadge = isApproved
    ? `<span style="background: rgba(16, 185, 129, 0.2); color: #10B981; padding: 4px 10px; border-radius: 4px; font-weight: bold;">CONFIRMED</span>`
    : `<span style="background: rgba(239, 68, 68, 0.2); color: #EF4444; padding: 4px 10px; border-radius: 4px; font-weight: bold;">REJECTED</span>`;

  try {
    await transporter.sendMail({
      from: `"Equinox Sports" <${from}>`,
      to: payload.user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #222;">
          <h2 style="color: ${headerColor}; margin-top: 0;">
            ${isApproved ? "Your Booking is Confirmed! 🎉" : "Booking Request Declined"}
          </h2>
          <p style="color: #a1a1a1; font-size: 14px;">
            Hi ${payload.user.name}, the administrator has reviewed your reservation request for <strong>${payload.venue.name}</strong>.
          </p>
          
          <div style="background-color: #141414; border: 1px solid #262626; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 6px 0; color: #ddd;"><strong>Booking ID:</strong> <span style="color: #F5B301;">${payload.booking.id}</span></p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Status:</strong> ${statusBadge}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Venue:</strong> ${payload.venue.name}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Court:</strong> ${payload.court.name}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Date:</strong> ${payload.booking.bookingDate}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Time Slot:</strong> ${payload.slot.label}</p>
            <p style="margin: 6px 0; color: #ddd;"><strong>Amount:</strong> ${payload.booking.currency} ${payload.booking.total}</p>
            ${!isApproved && reason ? `<p style="margin: 12px 0 0 0; color: #ff8888;"><strong>Reason:</strong> ${reason}</p>` : ""}
          </div>

          <p style="color: #a1a1a1; font-size: 13px;">
            ${isApproved
              ? "Please arrive 10 minutes before your slot timing. Equipment and coach desks will be available at the venue."
              : "If your payment was processed, a refund will be initiated to your original payment method automatically."}
          </p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="color: #666; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Equinox Sports Inc.</p>
        </div>
      `,
    });
    console.log(`[EMAIL] Booking ${decision} email sent to:`, payload.user.email);
  } catch (err) {
    console.error(`[EMAIL_ERROR] Failed to send booking ${decision} email:`, err);
  }
}

function sendWhatsAppMock(payload: NotificationPayload) {
  console.info("[WHATSAPP_MOCK]", {
    bookingId: payload.booking.id,
    to: payload.user.email,
    message: `Hi ${payload.user.name}, your booking request for ${payload.court.name} (${payload.slot.label}) on ${payload.booking.bookingDate} has been placed. Status: ${payload.booking.status}.`,
  });
}

export async function sendBookingNotifications(payload: NotificationPayload) {
  await sendBookingSubmittedEmail(payload);
  sendWhatsAppMock(payload);
}
