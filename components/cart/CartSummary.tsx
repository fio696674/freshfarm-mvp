"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";

const DELIVERY_FEE = 499; // $4.99 in cents

export function CartSummary() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = itemCount > 0 ? DELIVERY_FEE : 0;
  const orderTotal = total + deliveryFee;

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between text-sm text-stone-600">
          <span>Estimated Delivery</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>

        <div className="border-t border-stone-100 pt-3">
          <div className="flex justify-between font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatCurrency(orderTotal)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-terra-500 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
