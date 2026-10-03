export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAdmin } from "@/lib/session";
import { getVenues, getGames, getCourts } from "@/lib/store";
import { AdminCatalogManager } from "@/components/admin-catalog-manager";
import { MapPin, Dumbbell, Layers } from "lucide-react";

export default async function AdminCatalogPage() {
  await requireAdmin();
  const [venues, games, courts] = await Promise.all([
    getVenues(),
    getGames(),
    getCourts(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 py-12">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div>
          <span className="text-[#E5C158] font-bold uppercase tracking-wider text-xs">
            Infrastructure & Inventory
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Catalog Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create, edit, or remove venues, sports, and court specifications in real-time on Firebase.
          </p>
        </div>

        {/* Counts summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#E5C158]" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Venues</p>
              <p className="text-3xl font-black text-white">{venues.length}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-[#E5C158]" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Sports / Games</p>
              <p className="text-3xl font-black text-white">{games.length}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-[#E5C158]" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Courts Configured</p>
              <p className="text-3xl font-black text-white">{courts.length}</p>
            </div>
          </div>
        </div>

        <AdminCatalogManager initialVenues={venues} initialGames={games} initialCourts={courts} />
      </div>
    </div>
  );
}
