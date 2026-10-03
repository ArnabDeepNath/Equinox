"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Venue, Game, Court } from "@/lib/types";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Dumbbell,
  Layers,
  X,
  Check,
} from "lucide-react";

interface Props {
  initialVenues: Venue[];
  initialGames: Game[];
  initialCourts: Court[];
}

export function AdminCatalogManager({
  initialVenues,
  initialGames,
  initialCourts,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"venues" | "games" | "courts">("venues");

  const [venues, setVenues] = useState(initialVenues);
  const [games, setGames] = useState(initialGames);
  const [courts, setCourts] = useState(initialCourts);

  // Modal / Editing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null); // null means "Create new"
  const [loading, setLoading] = useState(false);

  // Form Fields
  // Venue
  const [vName, setVName] = useState("");
  const [vCity, setVCity] = useState("");
  const [vTimezone, setVTimezone] = useState("Asia/Kolkata");
  const [vCurrency, setVCurrency] = useState("INR");
  const [vAddress, setVAddress] = useState("");
  const [vImage, setVImage] = useState("");

  // Game
  const [gName, setGName] = useState("");
  const [gDescription, setGDescription] = useState("");
  const [gFeatures, setGFeatures] = useState("");
  const [gImage, setGImage] = useState("");
  const [gVenueIds, setGVenueIds] = useState("");

  // Court
  const [cName, setCName] = useState("");
  const [cVenueId, setCVenueId] = useState("");
  const [cGameId, setCGameId] = useState("");
  const [cBasePrice, setCBasePrice] = useState("1200");
  const [cDiscount, setCDiscount] = useState("15");
  const [cFeatures, setCFeatures] = useState("");
  const [cImage, setCImage] = useState("");

  function openCreate() {
    setEditTarget(null);
    if (activeTab === "venues") {
      setVName("");
      setVCity("Guwahati");
      setVTimezone("Asia/Kolkata");
      setVCurrency("INR");
      setVAddress("");
      setVImage("https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1200&auto=format&fit=crop");
    } else if (activeTab === "games") {
      setGName("");
      setGDescription("");
      setGFeatures("LED Lights, Locker Room");
      setGImage("https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1200&auto=format&fit=crop");
      setGVenueIds(venues.map((v) => v.id).join(", "));
    } else {
      setCName("");
      setCVenueId(venues[0]?.id || "");
      setCGameId(games[0]?.id || "");
      setCBasePrice("1200");
      setCDiscount("15");
      setCFeatures("Synthetic, Night play");
      setCImage("https://images.unsplash.com/photo-1622279457486-28f6f8d3e95a?q=80&w=1200&auto=format&fit=crop");
    }
    setIsModalOpen(true);
  }

  function openEdit(item: any) {
    setEditTarget(item);
    if (activeTab === "venues") {
      setVName(item.name);
      setVCity(item.city);
      setVTimezone(item.timezone);
      setVCurrency(item.currency);
      setVAddress(item.address);
      setVImage(item.image);
    } else if (activeTab === "games") {
      setGName(item.name);
      setGDescription(item.description);
      setGFeatures((item.features || []).join(", "));
      setGImage(item.image);
      setGVenueIds((item.venueIds || []).join(", "));
    } else {
      setCName(item.name);
      setCVenueId(item.venueId);
      setCGameId(item.gameId);
      setCBasePrice(String(item.basePrice));
      setCDiscount(String(item.memberDiscountPercent));
      setCFeatures((item.features || []).join(", "));
      setCImage(item.image);
    }
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const type = activeTab === "venues" ? "venue" : activeTab === "games" ? "game" : "court";
      let payload: any = { type };

      if (activeTab === "venues") {
        payload = {
          ...payload,
          name: vName,
          city: vCity,
          timezone: vTimezone,
          currency: vCurrency,
          address: vAddress,
          image: vImage,
        };
      } else if (activeTab === "games") {
        payload = {
          ...payload,
          name: gName,
          description: gDescription,
          image: gImage,
          features: gFeatures.split(",").map((s) => s.trim()).filter(Boolean),
          venueIds: gVenueIds.split(",").map((s) => s.trim()).filter(Boolean),
        };
      } else {
        payload = {
          ...payload,
          name: cName,
          venueId: cVenueId,
          gameId: cGameId,
          basePrice: Number(cBasePrice),
          memberDiscountPercent: Number(cDiscount),
          features: cFeatures.split(",").map((s) => s.trim()).filter(Boolean),
          image: cImage,
        };
      }

      const method = editTarget ? "PUT" : "POST";
      if (editTarget) {
        payload.id = editTarget.id;
      }

      const res = await fetch("/api/admin/catalog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item");

      toast.success(editTarget ? `${type} updated successfully!` : `${type} created successfully!`);
      setIsModalOpen(false);
      router.refresh();

      // Update local state smoothly
      if (activeTab === "venues") {
        if (editTarget) {
          setVenues((prev) => prev.map((v) => (v.id === editTarget.id ? { ...v, ...payload } : v)));
        } else {
          setVenues((prev) => [data.data, ...prev]);
        }
      } else if (activeTab === "games") {
        if (editTarget) {
          setGames((prev) => prev.map((g) => (g.id === editTarget.id ? { ...g, ...payload } : g)));
        } else {
          setGames((prev) => [data.data, ...prev]);
        }
      } else {
        if (editTarget) {
          setCourts((prev) => prev.map((c) => (c.id === editTarget.id ? { ...c, ...payload } : c)));
        } else {
          setCourts((prev) => [data.data, ...prev]);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save catalog entry");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const type = activeTab === "venues" ? "venue" : activeTab === "games" ? "game" : "court";
      const res = await fetch(`/api/admin/catalog?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success(`"${name}" removed successfully.`);
      if (activeTab === "venues") {
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } else if (activeTab === "games") {
        setGames((prev) => prev.filter((g) => g.id !== id));
      } else {
        setCourts((prev) => prev.filter((c) => c.id !== id));
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Deletion failed");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-neutral-900 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("venues")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "venues"
                ? "bg-[#E5C158] text-black shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Venues ({venues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("games")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "games"
                ? "bg-[#E5C158] text-black shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Sports / Games ({games.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("courts")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "courts"
                ? "bg-[#E5C158] text-black shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Courts ({courts.length})
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full gold-button  text-neutral-950 font-black px-6 py-2.5 text-xs uppercase tracking-wider transition shadow-lg shadow-[0_4px_20px_-2px_rgba(229,193,88,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab === "venues" ? "Venue" : activeTab === "games" ? "Game" : "Court"}
        </button>
      </div>

      {/* Venues View */}
      {activeTab === "venues" && (
        <div className="grid gap-6 md:grid-cols-2">
          {venues.map((v) => (
            <div
              key={v.id}
              className="rounded-3xl border border-white/10 bg-neutral-900/50 overflow-hidden flex flex-col justify-between group hover:border-[#E5C158]/40 transition"
            >
              <div className="relative h-48 w-full">
                <Image src={v.image} alt={v.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#E5C158] font-mono text-xs px-3 py-1 rounded-full border border-white/10">
                  ID: {v.id}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{v.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E5C158]" />
                    {v.address}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 border-y border-white/5 py-3">
                  <span>City: <strong className="text-white">{v.city}</strong></span>
                  <span>Currency: <strong className="text-[#E5C158] font-mono">{v.currency}</strong></span>
                  <span>Zone: <strong className="text-white">{v.timezone}</strong></span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => openEdit(v)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#E5C158]" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id, v.name)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Games View */}
      {activeTab === "games" && (
        <div className="grid gap-6 md:grid-cols-3">
          {games.map((g) => (
            <div
              key={g.id}
              className="rounded-3xl border border-white/10 bg-neutral-900/50 overflow-hidden flex flex-col justify-between hover:border-[#E5C158]/40 transition"
            >
              <div className="relative h-44 w-full">
                <Image src={g.image} alt={g.name} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#E5C158] font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-white/10">
                  {g.id}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{g.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{g.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(g.features || []).map((f) => (
                      <span
                        key={f}
                        className="bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[10px] text-gray-500">Venues: {(g.venueIds || []).join(", ")}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(g)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E5C158] transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(g.id, g.name)}
                      className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courts View */}
      {activeTab === "courts" && (
        <div className="grid gap-6 md:grid-cols-3">
          {courts.map((c) => {
            const v = venues.find((item) => item.id === c.venueId);
            const g = games.find((item) => item.id === c.gameId);

            return (
              <div
                key={c.id}
                className="rounded-3xl border border-white/10 bg-neutral-900/50 overflow-hidden flex flex-col justify-between hover:border-[#E5C158]/40 transition"
              >
                <div className="relative h-44 w-full">
                  <Image src={c.image} alt={c.name} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#E5C158] font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-white/10">
                    {c.id}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Venue: <strong className="text-gray-200">{v?.name || c.venueId}</strong> · Sport: <strong className="text-[#E5C158]">{g?.name || c.gameId}</strong>
                    </p>

                    <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-xl border border-white/5 mt-3 text-xs">
                      <span className="text-gray-400">Base Price:</span>
                      <span className="font-bold text-white">₹{c.basePrice}</span>
                      <span className="text-gray-400">Member Disc:</span>
                      <span className="font-bold text-[#E5C158]">{c.memberDiscountPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] text-gray-500">{(c.features || []).join(", ")}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E5C158] transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-neutral-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editTarget ? "Edit" : "Create"}{" "}
                {activeTab === "venues" ? "Venue" : activeTab === "games" ? "Game / Sport" : "Court"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Venues Form */}
              {activeTab === "venues" && (
                <>
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      required
                      placeholder="Equinox Beltola Complex"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">City</label>
                      <input
                        type="text"
                        value={vCity}
                        onChange={(e) => setVCity(e.target.value)}
                        required
                        placeholder="Guwahati"
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Currency</label>
                      <input
                        type="text"
                        value={vCurrency}
                        onChange={(e) => setVCurrency(e.target.value)}
                        required
                        placeholder="INR"
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Timezone</label>
                    <input
                      type="text"
                      value={vTimezone}
                      onChange={(e) => setVTimezone(e.target.value)}
                      required
                      placeholder="Asia/Kolkata"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Full Address</label>
                    <textarea
                      value={vAddress}
                      onChange={(e) => setVAddress(e.target.value)}
                      required
                      rows={2}
                      placeholder="Beltola / Ganeshguri, Guwahati"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={vImage}
                      onChange={(e) => setVImage(e.target.value)}
                      required
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </>
              )}

              {/* Games Form */}
              {activeTab === "games" && (
                <>
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Sport / Game Name</label>
                    <input
                      type="text"
                      value={gName}
                      onChange={(e) => setGName(e.target.value)}
                      required
                      placeholder="Paddle Tennis"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Description</label>
                    <textarea
                      value={gDescription}
                      onChange={(e) => setGDescription(e.target.value)}
                      required
                      rows={2}
                      placeholder="Professional paddle courts with evening lighting..."
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={gFeatures}
                      onChange={(e) => setGFeatures(e.target.value)}
                      placeholder="LED lights, Coach support, Locker room"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Associated Venue IDs (comma separated)</label>
                    <input
                      type="text"
                      value={gVenueIds}
                      onChange={(e) => setGVenueIds(e.target.value)}
                      placeholder="venue-1, venue-2"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={gImage}
                      onChange={(e) => setGImage(e.target.value)}
                      required
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </>
              )}

              {/* Courts Form */}
              {activeTab === "courts" && (
                <>
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Court Name</label>
                    <input
                      type="text"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      required
                      placeholder="Paddle Court Premium 1"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Venue</label>
                      <select
                        value={cVenueId}
                        onChange={(e) => setCVenueId(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-3 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      >
                        {venues.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Sport / Game</label>
                      <select
                        value={cGameId}
                        onChange={(e) => setCGameId(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-3 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      >
                        {games.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Base Price (INR)</label>
                      <input
                        type="number"
                        value={cBasePrice}
                        onChange={(e) => setCBasePrice(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Member Discount %</label>
                      <input
                        type="number"
                        value={cDiscount}
                        onChange={(e) => setCDiscount(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={cFeatures}
                      onChange={(e) => setCFeatures(e.target.value)}
                      placeholder="Glass court, Outdoor, Night play"
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={cImage}
                      onChange={(e) => setCImage(e.target.value)}
                      required
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full gold-button text-neutral-950 font-bold py-3 transition hover:brightness-110 disabled:opacity-50 text-sm shadow-lg"
                >
                  {loading ? "Saving..." : editTarget ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
