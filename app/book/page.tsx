import Link from "next/link";
import { redirect } from "next/navigation";
import { SectionTitle } from "@/components/section-title";
import { BookingFlow } from "@/components/booking-flow";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export default async function BookPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <SectionTitle
          title="Book Your Slot"
          subtitle="Select venue, game, court and timing. Pricing is calculated from backend rules."
        />
        <Link href="/membership">
          <Button variant="secondary">Request Membership</Button>
        </Link>
      </div>

      <BookingFlow user={user} />
    </div>
  );
}