"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

/* ── Framer Motion variants ─────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ── Product data ───────────────────────────────────────── */

const products = [
  {
    name: "Farm Fresh Dozen",
    price: "$8.99",
    description: "12 hand-selected eggs, less than 10 days old",
    gradient: "from-yolk-100 to-cream-200",
    eggCount: 12,
  },
  {
    name: "Jumbo 18-Pack",
    price: "$12.99",
    description: "18 premium large eggs for the egg lovers",
    gradient: "from-terra-100 to-cream-100",
    eggCount: 18,
  },
  {
    name: "Family Bundle",
    price: "$22.99",
    description: "36 eggs — enough for the whole family all week",
    gradient: "from-green-100 to-cream-200",
    eggCount: 36,
  },
];

/* ── Product card ───────────────────────────────────────── */

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image placeholder */}
      <div
        className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${product.gradient}`}
      >
        <span className="text-5xl" aria-hidden="true">
          🥚
        </span>
        <span className="absolute bottom-2 right-3 text-xs font-medium text-stone-400">
          {product.eggCount} eggs
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight text-stone-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-stone-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-light tracking-tight text-stone-900">
            {product.price}
          </span>
          <button className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 active:scale-[0.97]">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ProductShowcase component ──────────────────────────── */

export function ProductShowcase() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl font-light tracking-tight text-stone-900 md:text-4xl">
            Meet Our Eggs
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            Hand-picked from local farms, delivered fresh to your door.
          </p>
        </motion.div>

        {/* Product cards grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-green-600"
          >
            View All Products
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
