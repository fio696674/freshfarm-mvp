import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersPage() {
  // When connected to real data, replace this with an actual orders check
  const hasOrders = false;

  if (!hasOrders) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
        <p className="mt-2 text-stone-600">View and manage your orders.</p>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
            <Package className="h-10 w-10 text-stone-400" />
          </div>
          <h2 className="text-lg font-medium text-stone-900">No orders yet</h2>
          <p className="max-w-sm text-sm text-stone-500">
            Once you place your first order, it will appear here. Fresh eggs are just a few clicks away!
          </p>
          <Link
            href="/products"
            className="mt-2 inline-block rounded-full bg-terra-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
      <p className="mt-2 text-stone-600">View and manage your orders.</p>
    </div>
  );
}
