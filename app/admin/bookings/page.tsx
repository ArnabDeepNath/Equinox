import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminBookingsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Bookings"
        subtitle="Every booking is listed with amount and status for admin review."
      />

      <div className="space-y-3">
        {store.bookings.map((booking) => {
          const user = store.users.find((item) => item.id === booking.userId);
          const venue = store.venues.find((item) => item.id === booking.venueId);
          const court = store.courts.find((item) => item.id === booking.courtId);
          const slot = store.slots.find((item) => item.id === booking.slotId);

          return (
            <Card key={booking.id} className="grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Booking ID</p>
                <p className="text-sm font-semibold">{booking.id}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">User</p>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Venue/Court</p>
                <p className="text-sm">{venue?.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{court?.name}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Slot & Amount</p>
                <p className="text-sm">{slot?.label}</p>
                <p className="text-sm text-[var(--gold-soft)]">
                  {formatCurrency(booking.total, booking.currency)} • {booking.status}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}