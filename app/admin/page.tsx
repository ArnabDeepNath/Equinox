export const dynamic = "force-dynamic";
export const revalidate = 0;

﻿import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getAdminMetrics } from "@/lib/admin-metrics";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  Shield,
  Layers,
  FileText,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default async function AdminPage() {
  await requireAdmin();
  const metrics = await getAdminMetrics();

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-[#E5C158] font-bold uppercase tracking-wider text-xs">
            Equinox Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Admin MIS & Analytics Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time analytics, booking logs, membership reviews, transactions, and venue catalog control.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="w-5 h-5 text-[#E5C158]" />
            </div>
            <p className="text-3xl font-black text-white">{metrics.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">Multi-role active accounts</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Bookings</span>
              <CalendarCheck className="w-5 h-5 text-[#E5C158]" />
            </div>
            <p className="text-3xl font-black text-white">{metrics.confirmedBookings}</p>
            <p className="text-xs text-gray-500 mt-1">Total {metrics.totalBookings} reservation intents</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Booking Value</span>
              <TrendingUp className="w-5 h-5 text-[#E5C158]" />
            </div>
            <p className="text-3xl font-black text-[#E5C158]">₹{metrics.revenue.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-500 mt-1">Settled in INR across venues</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Memberships</span>
              <Clock className="w-5 h-5 text-[#E5C158]" />
            </div>
            <p className="text-3xl font-black text-white">{metrics.pendingMemberships}</p>
            <p className="text-xs text-[#E5C158] mt-1">Requires approval review</p>
          </div>
        </div>

        {/* Modules navigation */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/memberships"
            className="group rounded-3xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:border-[#E5C158]/50 hover:bg-neutral-900/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#E5C158]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E5C158] transition" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Membership Requests</h3>
            <p className="text-xs text-gray-400">
              Review applicant justifications, approve or decline tier upgrades for exclusive slot access.
            </p>
          </Link>

          <Link
            href="/admin/bookings"
            className="group rounded-3xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:border-[#E5C158]/50 hover:bg-neutral-900/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-[#E5C158]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E5C158] transition" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Bookings Register</h3>
            <p className="text-xs text-gray-400">
              Audit venue slot reservations, customer info, match timings, and payment status.
            </p>
          </Link>

          <Link
            href="/admin/transactions"
            className="group rounded-3xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:border-[#E5C158]/50 hover:bg-neutral-900/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#E5C158]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E5C158] transition" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Payment Transactions</h3>
            <p className="text-xs text-gray-400">
              Track mock checkout ledgers and verify customer settlement IDs ready for Razorpay/Instamojo.
            </p>
          </Link>

          <Link
            href="/admin/catalog"
            className="group rounded-3xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:border-[#E5C158]/50 hover:bg-neutral-900/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#E5C158]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E5C158] transition" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Catalog Management</h3>
            <p className="text-xs text-gray-400">
              Add new venues, configure sport court dimensions, pricing multipliers, and slot templates.
            </p>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="group rounded-3xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:border-[#E5C158]/50 hover:bg-neutral-900/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#E5C158]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E5C158] transition" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Audit Trail & Logs</h3>
            <p className="text-xs text-gray-400">
              Inspect admin approvals, court modifications, membership status mutations, and system events.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
