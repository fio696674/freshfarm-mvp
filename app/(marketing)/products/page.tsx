"use client";

import { ProductGrid } from "@/components/products/ProductGrid";

const mockProducts = [
  {
    id: "1",
    name: "Farm Fresh Dozen",
    description: "12 organic eggs, less than 10 days old",
    price: 899, // $8.99 in cents
    image_url: "/egg-dozen.jpg",
    stock_qty: 100,
  },
  {
    id: "2",
    name: "Jumbo 18-Pack",
    description: "18 jumbo eggs for the whole family",
    price: 1299, // $12.99 in cents
    image_url: "/egg-18pack.jpg",
    stock_qty: 50,
  },
  {
    id: "3",
    name: "Family Bundle",
    description: "24 eggs + seasonal extras — best value!",
    price: 2299, // $22.99 in cents
    image_url: "/egg-bundle.jpg",
    stock_qty: 30,
  },
];

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-light text-stone-900">Our Eggs</h1>
      <p className="mt-3 text-stone-500">
        Farm-fresh, pasture-raised eggs delivered to your door.
      </p>

      <div className="mt-10">
        <ProductGrid products={mockProducts} />
      </div>
    </section>
  );
}
