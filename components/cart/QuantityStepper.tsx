"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-xl border border-stone-200",
        className
      )}
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex size-8 items-center justify-center rounded-l-xl text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </motion.button>

      <span className="flex size-8 items-center justify-center text-sm font-medium text-stone-900">
        {value}
      </span>

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex size-8 items-center justify-center rounded-r-xl text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300"
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </motion.button>
    </div>
  );
}
