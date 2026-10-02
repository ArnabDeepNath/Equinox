export const dynamic = "force-dynamic";
export const revalidate = 0;

﻿import { requireAdmin } from "@/lib/session";
import { getAuditLogs } from "@/lib/store";
import { Shield, FileText } from "lucide-react";

export default async function AdminAuditLogsPage() {
  await requireAdmin();
  const logs = await getAuditLogs();

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Security & Governance
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Audit Trail & System Logs</h1>
          <p className="text-gray-400 text-sm mt-1">
            Immutable log of all administrative actions, membership approvals, court creations, and player activity.
          </p>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/30 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Entity: <span className="text-gray-200">{log.entity}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1 font-medium">{log.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 md:text-right flex-shrink-0">
                <div>
                  <p className="text-gray-300 font-semibold">{log.actorId}</p>
                  <p className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold">
                    {log.actorRole}
                  </p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <p className="font-mono">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  <p className="text-[10px]">{new Date(log.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
