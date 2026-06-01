"use client";

import { useState, useEffect } from "react";
import { MetricsCards } from "@/components/admin/MetricsCards";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface RecentOrder {
  id: string;
  customer: string;
  status: string;
  total: string;
  created_at: string;
}

const statusDotColor: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  preparing: "bg-orange-400",
  in_transit: "bg-violet-400",
  delivered: "bg-green-500",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  in_transit: "In Transit",
  delivered: "Delivered",
};

export default function AdminDashboardPage() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();

      const [
        ordersCountRes,
        ordersRes,
        customersRes,
        pendingRes,
        recentRes,
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("total_amount"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "confirmed"]),
        supabase
          .from("orders")
          .select("id, status, total_amount, created_at, profiles(full_name)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setTotalOrders(ordersCountRes.count ?? 0);
      setRevenue(
        (ordersRes.data ?? []).reduce(
          (sum, o) => sum + (o.total_amount ?? 0),
          0
        )
      );
      setActiveCustomers(customersRes.count ?? 0);
      setPendingOrders(pendingRes.count ?? 0);

      const mapped: RecentOrder[] = (recentRes.data ?? []).map((o) => {
        const profile = o.profiles as unknown as { full_name: string | null } | null;
        return {
          id: o.id,
          customer: profile?.full_name ?? "—",
          status: o.status,
          total: `$${(o.total_amount / 100).toFixed(2)}`,
          created_at: o.created_at,
        };
      });
      setRecentOrders(mapped);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Overview of your FreshFarm operations.
        </p>
      </div>

      <MetricsCards
        totalOrders={totalOrders}
        revenue={revenue}
        activeCustomers={activeCustomers}
        pendingOrders={pendingOrders}
        loading={loading}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-stone-900">
          Recent Orders
        </h2>
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-stone-400">
                    Loading...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-stone-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                          className={cn(
                            "size-2 rounded-full",
                            statusDotColor[order.status] ?? "bg-stone-300"
                          )}
                        />
                        {statusLabel[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                      {order.total}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
