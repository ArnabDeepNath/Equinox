import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/section-title";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const params = await searchParams;
  const booking = store.bookings.find((item) => item.id === params.bookingId);

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">Booking not found.</p>
          <Link href="/book" className="mt-4 inline-block">
            <Button>Back to booking</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const venue = store.venues.find((item) => item.id === booking.venueId);
  const court = store.courts.find((item) => item.id === booking.courtId);
  const slot = store.slots.find((item) => item.id === booking.slotId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Booking Confirmed"
        subtitle="Confirmation email sent. WhatsApp notification mocked in server logs."
      />

      <Card className="space-y-2">
        <p className="text-sm text-[var(--muted-foreground)]">Booking ID: {booking.id}</p>
        <h3 className="text-xl font-semibold">{venue?.name}</h3>
        <p className="text-sm">{court?.name}</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          {booking.bookingDate} • {slot?.label}
        </p>
        <p className="pt-2 text-lg font-semibold text-[var(--gold-soft)]">
          {formatCurrency(booking.total, booking.currency)}
        </p>

        <div className="pt-2 flex gap-2">
          <Link href="/book">
            <Button variant="secondary">Book another</Button>
          </Link>
          <Link href="/">
            <Button>Go home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}