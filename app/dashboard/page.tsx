"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Calendar } from "lucide-react";
import { OrderCard } from "@/components/dashboard/OrderCard";

const mockUser = { full_name: "John Smith", email: "john@example.com" };

const mockOrders = [
  {
    id: "ord_001",
    status: "delivered" as const,
    total: 1798,
    created_at: "2026-05-28",
    items_count: 2,
    delivery_method: "truck",
  },
  {
    id: "ord_002",
    status: "in_transit" as const,
    total: 899,
    created_at: "2026-05-30",
    items_count: 1,
    delivery_method: "drone",
  },
];

const quickActions = [
  { label: "Browse Products", href: "/", icon: Package },
  { label: "View Schedule", href: "/dashboard/schedule", icon: Calendar },
];

export default function DashboardPage() {
  const upcomingOrders = mockOrders.filter((o) => o.status === "in_transit");
  const recentOrders = mockOrders;

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-light text-stone-900">
          Welcome back, {mockUser.full_name.split(" ")[0]}
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
      <section>
        <h2 className="mb-4 text-lg font-medium text-stone-900">Recent Orders</h2>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-lg font-medium text-stone-900">Quick Actions</h2>
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
