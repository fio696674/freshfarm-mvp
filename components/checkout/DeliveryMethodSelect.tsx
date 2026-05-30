"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export type DeliveryMethod = "truck" | "drone" | "kiosk";

interface DeliveryOption {
  id: DeliveryMethod;
  icon: string;
  name: string;
  description: string;
  fee: number; // in cents
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "truck",
    icon: "🚚",
    name: "Truck Delivery",
    description: "Delivered to your doorstep within 1-2 days",
    fee: 499,
  },
  {
    id: "drone",
    icon: "🚁",
    name: "Drone Delivery",
    description: "Lightning-fast delivery in under 30 minutes",
    fee: 999,
  },
  {
    id: "kiosk",
    icon: "📱",
    name: "Kiosk Pickup",
    description: "Pick up from your nearest Fresh Farm kiosk",
    fee: 0,
  },
];

interface DeliveryMethodSelectProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

export function DeliveryMethodSelect({
  value,
  onChange,
}: DeliveryMethodSelectProps) {
  return (
    <div className="space-y-3">
      {DELIVERY_OPTIONS.map((option) => {
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "w-full rounded-xl border-2 p-4 text-left transition-all",
              isSelected
                ? "border-green-500 bg-green-50"
                : "border-stone-100 bg-white hover:border-stone-200"
            )}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                {option.icon}
              </span>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-stone-900">
                    {option.name}
                  </h3>
                  <span className="text-sm font-medium text-stone-600">
                    {option.fee === 0 ? "Free" : formatCurrency(option.fee)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected
                    ? "border-green-500 bg-green-500"
                    : "border-stone-300"
                )}
                aria-hidden="true"
              >
                {isSelected && (
                  <svg
                    className="size-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Delivery fee lookup by method, for use in order summary calculations */
export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  truck: 499,
  drone: 999,
  kiosk: 0,
};
