"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";

type Product = Omit<CartItem, "quantity"> & { description?: string; stock_qty?: number };

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-stone-900 hover:text-terra-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-1 text-sm text-stone-500 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-900">
            {formatCurrency(product.price)}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-terra-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
