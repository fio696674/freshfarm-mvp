"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered";

interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  total: string;
  deliveryMethod: string;
  date: string;
}

const defaultOrders: Order[] = [
  {
    id: "ORD-1001",
    customer: "Sarah Mitchell",
    status: "pending",
    total: "$42.99",
    deliveryMethod: "Truck",
    date: "May 28, 2026",
  },
  {
    id: "ORD-1002",
    customer: "James Park",
    status: "confirmed",
    total: "$27.50",
    deliveryMethod: "Drone",
    date: "May 28, 2026",
  },
  {
    id: "ORD-1003",
    customer: "Maria Garcia",
    status: "in_transit",
    total: "$65.00",
    deliveryMethod: "Truck",
    date: "May 27, 2026",
  },
  {
    id: "ORD-1004",
    customer: "David Chen",
    status: "delivered",
    total: "$34.75",
    deliveryMethod: "Drone",
    date: "May 27, 2026",
  },
  {
    id: "ORD-1005",
    customer: "Emily Johnson",
    status: "confirmed",
    total: "$51.20",
    deliveryMethod: "Truck",
    date: "May 26, 2026",
  },
  {
    id: "ORD-1006",
    customer: "Alex Thompson",
    status: "delivered",
    total: "$19.99",
    deliveryMethod: "Drone",
    date: "May 26, 2026",
  },
];

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

  const filteredOrders =
    activeFilter === "all"
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeFilter);

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
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-stone-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                    {order.id}
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
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-stone-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
