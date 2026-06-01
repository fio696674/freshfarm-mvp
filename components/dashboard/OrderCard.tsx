import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

type OrderStatus = "delivered" | "pending" | "confirmed" | "assigned" | "in_transit" | "cancelled";

const statusStyles: Record<
  OrderStatus,
  { dot: string; badge: string; label: string }
> = {
  delivered: {
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700",
    label: "Delivered",
  },
  pending: {
    dot: "bg-yellow-500",
    badge: "bg-yellow-50 text-yellow-700",
    label: "Pending",
  },
  confirmed: {
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
    label: "Confirmed",
  },
  assigned: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    label: "Assigned",
  },
  in_transit: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    label: "In Transit",
  },
  cancelled: {
    dot: "bg-stone-400",
    badge: "bg-stone-50 text-stone-600",
    label: "Cancelled",
  },
};

export interface OrderCardProps {
  order: {
    id: string;
    status: OrderStatus;
    total: number;
    created_at: string;
    items_count: number;
    delivery_method?: string;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const style = statusStyles[order.status] ?? statusStyles.pending;
  const displayId = order.id.length > 12 ? order.id.slice(0, 12) + "…" : order.id;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Status badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            style.badge
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", style.dot)} />
          {style.label}
        </span>

        {/* Order info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-stone-900">{displayId}</span>
          <span className="text-xs text-stone-500">
            {order.created_at} · {order.items_count} item{order.items_count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Total */}
        <span className="text-sm font-semibold text-stone-900">
          {formatCurrency(order.total)}
        </span>

        {/* View details link */}
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="text-sm font-medium text-terra-500 transition-colors hover:text-terra-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
