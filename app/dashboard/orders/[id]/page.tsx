"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { QRCodeDisplay } from "@/components/dashboard/QRCodeDisplay";
import { createClient } from "@/lib/supabase/client";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type DeliveryAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  product_id: string;
  products: {
    name: string;
    image_url: string | null;
  } | null;
};

type Order = {
  id: string;
  status: string;
  delivery_method: string;
  delivery_address: DeliveryAddress | null;
  total_amount: number;
  qr_code_token: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-stone-100 text-stone-600"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-stone-200" />
      <div className="space-y-3">
        <div className="h-7 w-48 rounded bg-stone-200" />
        <div className="h-4 w-64 rounded bg-stone-200" />
      </div>
      <div className="h-48 rounded-2xl border border-stone-100 bg-white p-6">
        <div className="h-5 w-32 rounded bg-stone-200 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full rounded bg-stone-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrder() {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (dbError || !data) {
        notFound();
        return;
      }

      setOrder(data as Order);
      setLoading(false);
    }

    fetchOrder().catch(() => {
      if (!cancelled) setError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || error) return <Skeleton />;
  if (!order) return null;

  const address = order.delivery_address as DeliveryAddress | null;

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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-light text-stone-900">
            Order {order.id.slice(0, 8)}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-stone-500">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {order.delivery_method === "delivery" ? "Home Delivery" : "Kiosk Pickup"}
        </p>
      </div>

      {/* Timeline */}
      <section className="rounded-2xl border border-stone-100 bg-white p-6">
        <h2 className="mb-5 text-lg font-medium text-stone-900">Order Status</h2>
        <OrderTimeline
          currentStatus={
            order.status as
              | "pending"
              | "confirmed"
              | "assigned"
              | "in_transit"
              | "delivered"
          }
          timeline={[
            {
              step: "pending",
              completed_at:
                order.status === "pending" || order.status === "confirmed" || order.status === "preparing" || order.status === "out_for_delivery" || order.status === "delivered"
                  ? order.created_at
                  : null,
            },
            {
              step: "confirmed",
              completed_at:
                order.status === "confirmed" || order.status === "preparing" || order.status === "out_for_delivery" || order.status === "delivered"
                  ? order.updated_at
                  : null,
            },
            {
              step: "assigned",
              completed_at:
                order.status === "out_for_delivery" || order.status === "delivered"
                  ? order.updated_at
                  : null,
            },
            {
              step: "in_transit",
              completed_at:
                order.status === "out_for_delivery" || order.status === "delivered"
                  ? order.updated_at
                  : null,
            },
            {
              step: "delivered",
              completed_at: order.status === "delivered" ? order.updated_at : null,
            },
          ]}
        />
      </section>

      {/* Items */}
      {order.order_items.length > 0 && (
        <section className="rounded-2xl border border-stone-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-stone-900">Items</h2>
          <ul className="divide-y divide-stone-100">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {item.products?.name ?? "Unknown product"}
                  </p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {formatCurrency(item.unit_price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
            <span className="text-sm font-medium text-stone-600">Total</span>
            <span className="text-lg font-semibold text-stone-900">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </section>
      )}

      {/* Delivery Address (for delivery orders) */}
      {order.delivery_method === "delivery" && address && (
        <section className="rounded-2xl border border-stone-100 bg-white p-6">
          <h2 className="mb-3 text-lg font-medium text-stone-900">Delivery Address</h2>
          <div className="text-sm text-stone-600 space-y-0.5">
            {address.line1 && <p>{address.line1}</p>}
            {address.line2 && <p>{address.line2}</p>}
            {(address.city || address.state || address.zip) && (
              <p>
                {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* QR Code for kiosk */}
      {order.delivery_method === "kiosk" && order.qr_code_token && (
        <section>
          <h2 className="mb-4 text-lg font-medium text-stone-900">
            Kiosk Pickup
          </h2>
          <QRCodeDisplay token={order.qr_code_token} />
        </section>
      )}
    </div>
  );
}
