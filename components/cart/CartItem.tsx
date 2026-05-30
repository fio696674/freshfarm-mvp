"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils";
import { QuantityStepper } from "./QuantityStepper";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className="flex items-center gap-4 border-b border-stone-100 py-4">
      {/* Thumbnail */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Name + quantity */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <h3 className="truncate text-sm font-semibold text-stone-900">
          {item.name}
        </h3>
        <QuantityStepper
          value={item.quantity}
          onChange={(q) => updateQuantity(item.id, q)}
        />
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-semibold text-stone-900">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="text-stone-400 transition-colors hover:text-stone-600"
          aria-label={`Remove ${item.name}`}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
