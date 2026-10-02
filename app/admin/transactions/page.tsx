import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminTransactionsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Transactions"
        subtitle="Mock payment records for POC with gateway abstraction compatibility."
      />

      <div className="space-y-3">
        {store.transactions.map((transaction) => (
          <Card key={transaction.id} className="grid gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Transaction</p>
              <p className="text-sm font-semibold">{transaction.id}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Booking</p>
              <p className="text-sm">{transaction.bookingId}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Amount</p>
              <p className="text-sm text-[var(--gold-soft)]">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Method/Status</p>
              <p className="text-sm">
                {transaction.method} • {transaction.status}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}