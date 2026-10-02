import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { getAdminMetrics } from "@/lib/admin-metrics";

export default async function AdminPage() {
  await requireAdmin();
  const metrics = getAdminMetrics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Admin Dashboard"
        subtitle="Analytics, bookings, transactions, memberships, logs and catalog controls."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Total Users</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Confirmed Bookings</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.confirmedBookings}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Revenue (POC)</p>
          <p className="mt-2 text-2xl font-semibold">₹{metrics.revenue}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Pending Memberships</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.pendingMemberships}</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AdminNavCard href="/admin/bookings" title="Bookings" description="Review all bookings and slot usage." />
        <AdminNavCard
          href="/admin/transactions"
          title="Transactions"
          description="Monitor mock payment states and totals."
        />
        <AdminNavCard
          href="/admin/memberships"
          title="Membership Requests"
          description="Approve or reject member access requests."
        />
        <AdminNavCard
          href="/admin/catalog"
          title="Catalog Management"
          description="Create venues, games, and courts."
        />
        <AdminNavCard
          href="/admin/audit-logs"
          title="Audit Logs"
          description="Trace all privileged actions and user operations."
        />
      </div>
    </div>
  );
}

function AdminNavCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:border-[var(--gold)]">
        <h3 className="text-lg font-semibold text-[var(--gold-soft)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
      </Card>
    </Link>
  );
}