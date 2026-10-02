"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CatalogType = "venue" | "game" | "court";

export function AdminCatalogForm() {
  const [type, setType] = useState<CatalogType>("venue");
  const [loading, setLoading] = useState(false);

  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1200&auto=format&fit=crop");

  const [gameName, setGameName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("Flood Lights, Parking");
  const [venueIds, setVenueIds] = useState("venue-1");

  const [courtVenueId, setCourtVenueId] = useState("venue-1");
  const [courtGameId, setCourtGameId] = useState("game-1");
  const [courtName, setCourtName] = useState("");
  const [courtFeatures, setCourtFeatures] = useState("Locker Room, Coach Desk");
  const [basePrice, setBasePrice] = useState("1000");
  const [discount, setDiscount] = useState("10");

  async function submit() {
    setLoading(true);
    try {
      let payload: Record<string, unknown> = {};

      if (type === "venue") {
        payload = {
          type,
          name: venueName,
          city,
          timezone,
          currency,
          address,
          image,
        };
      }

      if (type === "game") {
        payload = {
          type,
          name: gameName,
          description,
          image,
          features: features.split(",").map((item) => item.trim()),
          venueIds: venueIds.split(",").map((item) => item.trim()),
        };
      }

      if (type === "court") {
        payload = {
          type,
          venueId: courtVenueId,
          gameId: courtGameId,
          name: courtName,
          image,
          features: courtFeatures.split(",").map((item) => item.trim()),
          basePrice,
          memberDiscountPercent: discount,
        };
      }

      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create catalog entry");

      toast.success(`${type} created`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[var(--muted-foreground)]">Entity type</label>
        <select
          className="w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm"
          value={type}
          onChange={(event) => setType(event.target.value as CatalogType)}
        >
          <option value="venue">Venue</option>
          <option value="game">Game</option>
          <option value="court">Court</option>
        </select>
      </div>

      {type === "venue" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Venue name" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          <Input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          <Textarea className="md:col-span-2" rows={2} placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input className="md:col-span-2" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
      ) : null}

      {type === "game" ? (
        <div className="grid gap-3">
          <Input placeholder="Game name" value={gameName} onChange={(e) => setGameName(e.target.value)} />
          <Textarea rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <Input
            placeholder="Features comma separated"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <Input
            placeholder="Venue IDs comma separated"
            value={venueIds}
            onChange={(e) => setVenueIds(e.target.value)}
          />
        </div>
      ) : null}

      {type === "court" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Venue ID" value={courtVenueId} onChange={(e) => setCourtVenueId(e.target.value)} />
          <Input placeholder="Game ID" value={courtGameId} onChange={(e) => setCourtGameId(e.target.value)} />
          <Input className="md:col-span-2" placeholder="Court name" value={courtName} onChange={(e) => setCourtName(e.target.value)} />
          <Input className="md:col-span-2" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <Input
            className="md:col-span-2"
            placeholder="Features comma separated"
            value={courtFeatures}
            onChange={(e) => setCourtFeatures(e.target.value)}
          />
          <Input placeholder="Base price" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
          <Input placeholder="Member discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
      ) : null}

      <Button onClick={submit} disabled={loading}>
        {loading ? "Saving..." : `Create ${type}`}
      </Button>
    </Card>
  );
}