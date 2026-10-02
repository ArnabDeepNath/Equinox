import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { store } from "@/lib/store";
import { AdminMembershipActions } from "@/components/admin-membership-actions";

export default async function AdminMembershipPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Membership Requests"
        subtitle="Approve or reject users for exclusive member slots and discounts."
      />

      <div className="space-y-3">
        {store.membershipRequests.map((request) => {
          const user = store.users.find((item) => item.id === request.userId);
          const pending = request.status === "pending";

          return (
            <Card key={request.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{user?.name ?? request.userId}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{user?.email}</p>
                </div>
                <p className="text-xs text-[var(--gold-soft)]">Status: {request.status}</p>
              </div>

              <p className="text-sm text-[var(--muted-foreground)]">{request.reason}</p>

              {pending ? (
                <AdminMembershipActions requestId={request.id} />
              ) : (
                <p className="text-xs text-[var(--muted-foreground)]">
                  Reviewed by {request.reviewedBy ?? "system"} at {request.reviewedAt ?? "n/a"}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}