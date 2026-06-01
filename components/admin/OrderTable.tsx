"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "preparing";

interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  total: string;
  deliveryMethod: string;
  date: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  pending: {
    label: "Pending",
    dotColor: "bg-amber-400",
    textColor: "text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    dotColor: "bg-blue-400",
    textColor: "text-blue-700",
  },
  preparing: {
    label: "Preparing",
    dotColor: "bg-orange-400",
    textColor: "text-orange-700",
  },
  in_transit: {
    label: "In Transit",
    dotColor: "bg-violet-400",
    textColor: "text-violet-700",
  },
  delivered: {
    label: "Delivered",
    dotColor: "bg-green-500",
    textColor: "text-green-700",
  },
};

const filterTabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
];

export function OrderTable() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
        return;
      }

      const mapped: Order[] = data.map((o) => {
        const profiles = o.profiles as { full_name: string }[] | null;
        const profile = profiles?.[0] ?? null;
        const dateObj = new Date(o.created_at);
        return {
          id: o.id,
          customer: profile?.full_name ?? "—",
          status: o.status as OrderStatus,
          total: `$${(o.total_amount / 100).toFixed(2)}`,
          deliveryMethod: o.delivery_method ?? "—",
          date: dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
      });

      setOrders(mapped);
      setLoading(false);
    }

    fetchOrders();
  }, []);

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-stone-100 p-4">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === tab.value
                ? "bg-green-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Delivery</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status] ?? statusConfig.pending;
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-stone-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                      {order.customer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center gap-2 text-sm">
                        <span
                          className={cn("size-2 rounded-full", status.dotColor)}
                        />
                        <span className={cn("font-medium", status.textColor)}>
                          {status.label}
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                      {order.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-600">
                      {order.deliveryMethod}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                      {order.date}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
