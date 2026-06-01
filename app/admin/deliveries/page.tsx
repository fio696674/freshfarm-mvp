"use client";

import { useState, useEffect, useCallback } from "react";
import { DeliveryQueue } from "@/components/admin/DeliveryQueue";
import { createClient } from "@/lib/supabase/client";

interface DeliveryItem {
  id: string;
  customerName: string;
  address: string;
  items: string;
}

export default function DeliveriesPage() {
  const [queue, setQueue] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .eq("status", "confirmed")
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.error("Failed to fetch delivery queue:", error);
      setLoading(false);
      return;
    }

    const mapped: DeliveryItem[] = data.map((o) => {
      const profiles = o.profiles as { full_name: string }[] | null;
      const profile = profiles?.[0] ?? null;
      const addr = o.delivery_address as Record<string, string> | null;
      const address = addr
        ? [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ")
        : "—";
      return {
        id: o.id,
        customerName: profile?.full_name ?? "—",
        address,
        items: o.notes ?? "—",
      };
    });

    setQueue(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Delivery Queue</h1>
        <p className="mt-1 text-sm text-stone-500">
          Assign and manage unconfirmed deliveries.
        </p>
      </div>

      <DeliveryQueue queue={queue} loading={loading} onAssigned={fetchQueue} />
    </div>
  );
}
