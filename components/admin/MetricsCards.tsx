import {
  ShoppingBag,
  DollarSign,
  Users,
  Truck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}

const metrics: MetricCard[] = [
  {
    label: "Total Orders",
    value: "156",
    icon: <ShoppingBag className="size-5" />,
    trend: 12,
  },
  {
    label: "Revenue",
    value: "$2,847",
    icon: <DollarSign className="size-5" />,
    trend: 12,
  },
  {
    label: "Active Customers",
    value: "89",
    icon: <Users className="size-5" />,
    trend: -3,
  },
  {
    label: "Pending Deliveries",
    value: "12",
    icon: <Truck className="size-5" />,
    trend: 5,
  },
];

const iconBgColors = [
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
];

export function MetricsCards() {
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
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                metric.trend >= 0 ? "text-green-600" : "text-red-500"
              )}
            >
              {metric.trend >= 0 ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {metric.trend >= 0 ? "+" : ""}
              {metric.trend}%
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
