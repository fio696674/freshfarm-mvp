import { ShoppingBag, DollarSign, Users, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardsProps {
  totalOrders: number;
  revenue: number;
  activeCustomers: number;
  pendingOrders: number;
  loading?: boolean;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const iconBgColors = [
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
];

export function MetricsCards({
  totalOrders,
  revenue,
  activeCustomers,
  pendingOrders,
  loading = false,
}: MetricsCardsProps) {
  const metrics = [
    {
      label: "Total Orders",
      value: loading ? "—" : String(totalOrders),
      icon: <ShoppingBag className="size-5" />,
    },
    {
      label: "Revenue",
      value: loading ? "—" : formatCents(revenue),
      icon: <DollarSign className="size-5" />,
    },
    {
      label: "Active Customers",
      value: loading ? "—" : String(activeCustomers),
      icon: <Users className="size-5" />,
    },
    {
      label: "Pending Orders",
      value: loading ? "—" : String(pendingOrders),
      icon: <Truck className="size-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-stone-100 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full",
                iconBgColors[index]
              )}
            >
              {metric.icon}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-stone-900">{metric.value}</p>
            <p className="mt-1 text-sm text-stone-500">{metric.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
