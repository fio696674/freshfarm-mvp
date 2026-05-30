"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { QRCodeDisplay } from "@/components/dashboard/QRCodeDisplay";

const mockOrderDetails: Record<string, {
  id: string;
  status: "pending" | "confirmed" | "assigned" | "in_transit" | "delivered";
  total: number;
  created_at: string;
  delivery_method: string;
  timeline: { step: "pending" | "confirmed" | "assigned" | "in_transit" | "delivered"; completed_at: string | null }[];
  items: { name: string; quantity: number; price: number }[];
  locker_token?: string;
}> = {
  ord_001: {
    id: "ord_001",
    status: "delivered",
    total: 1798,
    created_at: "2026-05-28",
    delivery_method: "truck",
    timeline: [
      { step: "pending", completed_at: "May 28, 9:00 AM" },
      { step: "confirmed", completed_at: "May 28, 9:15 AM" },
      { step: "assigned", completed_at: "May 28, 11:00 AM" },
      { step: "in_transit", completed_at: "May 28, 2:00 PM" },
      { step: "delivered", completed_at: "May 28, 4:30 PM" },
    ],
    items: [
      { name: "Farm Fresh Dozen", quantity: 1, price: 899 },
      { name: "Jumbo 18-Pack", quantity: 1, price: 899 },
    ],
  },
  ord_002: {
    id: "ord_002",
    status: "in_transit",
    total: 899,
    created_at: "2026-05-30",
    delivery_method: "kiosk",
    timeline: [
      { step: "pending", completed_at: "May 30, 8:00 AM" },
      { step: "confirmed", completed_at: "May 30, 8:10 AM" },
      { step: "assigned", completed_at: "May 30, 10:00 AM" },
      { step: "in_transit", completed_at: "May 30, 11:30 AM" },
      { step: "delivered", completed_at: null },
    ],
    items: [{ name: "Family Bundle", quantity: 1, price: 899 }],
    locker_token: "FRSH-ORD002-2026",
  },
};

const fallbackOrder = {
  id: "unknown",
  status: "pending" as const,
  total: 0,
  created_at: "—",
  delivery_method: "truck",
  timeline: [
    { step: "pending" as const, completed_at: null },
    { step: "confirmed" as const, completed_at: null },
    { step: "assigned" as const, completed_at: null },
    { step: "in_transit" as const, completed_at: null },
    { step: "delivered" as const, completed_at: null },
  ],
  items: [] as { name: string; quantity: number; price: number }[],
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = mockOrderDetails[id] ?? { ...fallbackOrder, id };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-terra-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-stone-900">
          Order {order.id}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Placed on {order.created_at} · {order.delivery_method} delivery
        </p>
      </div>

      {/* Timeline */}
      <section className="rounded-2xl border border-stone-100 bg-white p-6">
        <h2 className="mb-5 text-lg font-medium text-stone-900">Order Status</h2>
        <OrderTimeline
          currentStatus={order.status}
          timeline={order.timeline}
        />
      </section>

      {/* Items */}
      {order.items.length > 0 && (
        <section className="rounded-2xl border border-stone-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-stone-900">Items</h2>
          <ul className="divide-y divide-stone-100">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-stone-900">{item.name}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {formatCurrency(item.price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
            <span className="text-sm font-medium text-stone-600">Total</span>
            <span className="text-lg font-semibold text-stone-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </section>
      )}

      {/* QR Code for kiosk */}
      {order.delivery_method === "kiosk" && order.locker_token && (
        <section>
          <h2 className="mb-4 text-lg font-medium text-stone-900">
            Locker Pickup
          </h2>
          <QRCodeDisplay token={order.locker_token} />
        </section>
      )}
    </div>
  );
}
