"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Calendar } from "lucide-react";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [fullName, setFullName] = useState("there");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        // Fetch profile for greeting
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.user.id)
          .single();
        if (profile?.full_name) {
          setFullName(profile.full_name.split(" ")[0]);
        }

        // Fetch recent orders
        const { data: recentOrders } = await supabase
          .from("orders")
          .select("id, status, total, created_at, delivery_method")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setOrders(recentOrders || []);
      }
      setLoading(false);
    });
  }, []);

  const upcomingOrders = orders.filter(
    (o) => o.status === "in_transit" || o.status === "assigned"
  );
  const recentOrders = orders;

  const quickActions = [
    { label: "Browse Products", href: "/", icon: Package },
    { label: "View Schedule", href: "/dashboard/schedule", icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="h-10 w-64 animate-pulse rounded bg-stone-100" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-light text-stone-900">
          Welcome back, {fullName}
        </h1>
        <p className="mt-1 text-stone-500">
          Here&apos;s what&apos;s happening with your orders.
        </p>
      </motion.div>

      {/* Upcoming deliveries */}
      {upcomingOrders.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-medium text-stone-900">
            Upcoming Deliveries
          </h2>
          <div className="space-y-3">
            {upcomingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Recent orders */}
      {recentOrders.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-medium text-stone-900">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-stone-100 bg-white p-8 text-center">
          <p className="text-stone-500">
            No orders yet. Place your first order to see it here!
          </p>
        </section>
      )}

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-lg font-medium text-stone-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-terra-300 hover:text-terra-600"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
