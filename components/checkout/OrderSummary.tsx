"use client";

import { Loader2 } from "lucide-react";
import { type CartItem } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";
import { type DeliveryMethod, DELIVERY_FEES } from "./DeliveryMethodSelect";

interface OrderSummaryProps {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  onPay: () => void;
  isProcessing: boolean;
}

export function OrderSummary({
  items,
  deliveryMethod,
  onPay,
  isProcessing,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>

      {/* Line items */}
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm text-stone-600"
          >
            <span className="truncate pr-2">
              {item.name} &times; {item.quantity}
            </span>
            <span className="shrink-0 font-medium text-stone-900">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm text-stone-600">
          <span>Delivery</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>

        <div className="border-t border-stone-100 pt-3">
          <div className="flex justify-between font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Pay button */}
      <button
        type="button"
        onClick={onPay}
        disabled={isProcessing || items.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terra-500 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay with Stripe"
        )}
      </button>
    </div>
  );
}
