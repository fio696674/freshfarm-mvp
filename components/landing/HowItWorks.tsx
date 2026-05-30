"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Truck, Smartphone } from "lucide-react";

/* ── Framer Motion variants ─────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ── Steps data ─────────────────────────────────────────── */

const steps = [
  {
    number: 1,
    title: "Order",
    description:
      "Browse our fresh eggs and place your order in 30 seconds",
    icon: ShoppingBag,
    color: "text-yolk-600",
    bgColor: "bg-yolk-50",
  },
  {
    number: 2,
    title: "We Deliver",
    description:
      "Farm-fresh eggs delivered by truck or drone to your area",
    icon: Truck,
    color: "text-terra-600",
    bgColor: "bg-terra-50",
  },
  {
    number: 3,
    title: "Pick Up",
    description:
      "Scan your QR code at a nearby smart locker",
    icon: Smartphone,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

/* ── HowItWorks component ───────────────────────────────── */

export function HowItWorks() {
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
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            Three simple steps from farm to your kitchen.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Dashed connector line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px md:block">
            <div className="mx-auto h-full max-w-2xl border-t-2 border-dashed border-stone-200" />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white shadow-lg shadow-green-600/20">
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${step.bgColor}`}
                >
                  <Icon className={`h-7 w-7 ${step.color}`} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-stone-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="max-w-xs leading-relaxed text-stone-500">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
