"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";
import { QuantityStepper } from "@/components/cart/QuantityStepper";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="h-96 animate-pulse rounded-2xl bg-stone-100" />
      </div>
    );
  }

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: any }) {
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
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-yolk-100 to-cream-200">
              <span className="text-8xl">🥚</span>
            </div>
          )}
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
