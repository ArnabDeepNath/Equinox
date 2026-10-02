import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { store } from "@/lib/store";
import { AdminCatalogForm } from "@/components/admin-catalog-form";

export default async function AdminCatalogPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Catalog Management"
        subtitle="Add venues, games, and courts from admin panel for multi-venue setup."
      />

      <AdminCatalogForm />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Venues</p>
          <p className="mt-1 text-2xl font-semibold">{store.venues.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Games</p>
          <p className="mt-1 text-2xl font-semibold">{store.games.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted-foreground)]">Courts</p>
          <p className="mt-1 text-2xl font-semibold">{store.courts.length}</p>
        </Card>
      </section>
    </div>
  );
}