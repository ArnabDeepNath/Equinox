import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import { store } from "@/lib/store";

export default async function AdminAuditLogsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        title="Audit Logs"
        subtitle="Trace privileged actions for compliance, debugging, and operations visibility."
      />

      <div className="space-y-3">
        {store.auditLogs.map((log) => (
          <Card key={log.id} className="grid gap-2 md:grid-cols-5">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Action</p>
              <p className="text-sm font-semibold">{log.action}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Actor</p>
              <p className="text-sm">
                {log.actorId} ({log.actorRole})
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Entity</p>
              <p className="text-sm">{log.entity}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Details</p>
              <p className="text-sm">{log.details}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">At</p>
              <p className="text-sm">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}