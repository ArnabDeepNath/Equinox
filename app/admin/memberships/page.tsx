export const dynamic = "force-dynamic";
export const revalidate = 0;

﻿import { requireAdmin } from "@/lib/session";
import { getMembershipRequests } from "@/lib/store";
import { AdminMembershipActions } from "@/components/admin-membership-actions";
import { User, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function AdminMembershipPage() {
  await requireAdmin();
  const requests = await getMembershipRequests();

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Approval Queue
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Membership Requests</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review user membership applications. Approving grants access to VIP slots and automated pricing discounts.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center text-gray-400">
            No membership requests submitted. When players apply from their profile, they will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const pending = request.status === "pending";

              return (
                <div
                  key={request.id}
                  className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 space-y-4 hover:border-amber-500/30 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">User ID: {request.userId}</p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      {request.status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : request.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-neutral-950 p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Applicant Justification</p>
                    <p className="text-sm text-gray-200 leading-relaxed italic">
                      "{request.reason}"
                    </p>
                  </div>

                  {pending ? (
                    <div className="pt-2 flex justify-end">
                      <AdminMembershipActions requestId={request.id} />
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-right">
                      Reviewed by {request.reviewedBy || "Admin"} on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
