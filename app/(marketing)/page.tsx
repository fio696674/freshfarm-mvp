"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroEgg } from "@/components/landing/HeroEgg";
import { ValueProps } from "@/components/landing/ValueProps";

/* ── Framer Motion variants ─────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

/* ── Trust badges ──────────────────────────────────────── */

const trustBadges = [
  { emoji: "\u{1F95A}", text: "Farm Fresh" },
  { emoji: "\u{1F4CD}", text: "Local Delivery" },
  { emoji: "\u{1F4F1}", text: "QR Pickup" },
];

/* ── Page ──────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background gradient — cream-50 → yolk-50 → cream-100 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #fefdf8 0%, #fffbeb 45%, #fdf9ed 100%)",
          }}
        />

        {/* Subtle aurora accent blobs */}
        <div
          className="absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
        />
        <div
          className="absolute -right-[15%] top-[30%] h-[400px] w-[400px] rounded-full opacity-[0.08] blur-[80px]"
          style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-4 sm:px-6">
          <motion.div
            className="flex flex-1 flex-col items-center justify-center py-24 text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* 3D Egg */}
            <motion.div variants={fadeUp}>
              <HeroEgg />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-6xl font-light tracking-tight text-stone-900 md:text-8xl"
            >
              Farm Fresh Eggs
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl"
            >
              Under 10 Days Old
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-full bg-terra-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-terra-500/25 transition-colors hover:bg-terra-600 hover:shadow-xl hover:shadow-terra-500/30 active:scale-[0.98]"
              >
                Order Fresh Eggs
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500 md:gap-8"
            >
              {trustBadges.map((badge) => (
                <span key={badge.text} className="flex items-center gap-2">
                  <span aria-hidden="true">{badge.emoji}</span>
                  <span>{badge.text}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ VALUE PROPS ═══════════════════ */}
      <ValueProps />
    </>
  );
}
