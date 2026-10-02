export const dynamic = "force-dynamic";
export const revalidate = 0;

﻿import { requireAdmin } from "@/lib/session";
import { getTransactions } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default async function AdminTransactionsPage() {
  await requireAdmin();
  const transactions = await getTransactions();

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Financial Ledger
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Payment Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Reconciled payments processed via the mock gateway, architected for direct Razorpay & Instamojo migration.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center text-gray-400">
            No transactions generated yet. Completed checkout orders will record here.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{t.id}</span>
                      <span className="text-xs text-gray-400">
                        ({new Date(t.createdAt).toLocaleString()})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Linked Booking: <span className="font-mono text-gray-200">{t.bookingId}</span> · Customer: <span className="font-mono text-gray-200">{t.userId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-black text-amber-400">
                      {formatCurrency(t.amount, t.currency)}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">
                      Gateway: {t.method}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
