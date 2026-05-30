"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useState } from "react";

const mockProducts = [
  {
    id: "1",
    name: "Farm Fresh Dozen",
    description: "12 organic eggs, less than 10 days old",
    price: 899,
    image_url: "/egg-dozen.jpg",
    stock_qty: 100,
  },
  {
    id: "2",
    name: "Jumbo 18-Pack",
    description: "18 jumbo eggs for the whole family",
    price: 1299,
    image_url: "/egg-18pack.jpg",
    stock_qty: 50,
  },
  {
    id: "3",
    name: "Family Bundle",
    description: "24 eggs + seasonal extras — best value!",
    price: 2299,
    image_url: "/egg-bundle.jpg",
    stock_qty: 30,
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({
  product,
}: {
  product: (typeof mockProducts)[number];
}) {
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
    toast.success(`${quantity}× ${product.name} added to cart`);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Back link */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-terra-600"
      >
        <ArrowLeft className="size-4" />
        Back to Products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-square overflow-hidden rounded-2xl"
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-light text-stone-900">{product.name}</h1>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-4 text-stone-500 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600">Quantity</span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stock_qty ?? 99}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAddToCart}
              className="rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
            >
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
