"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/stores/cart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const items = useCart((s) => s.items);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl" aria-hidden="true">
            🥚
          </span>
          <h1 className="text-2xl font-light text-stone-900">
            Your cart is empty
          </h1>
          <p className="text-stone-500">
            Add some farm-fresh eggs to get started.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-light text-stone-900">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Items list */}
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary sidebar */}
        <div>
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
