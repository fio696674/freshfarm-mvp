"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ── GreatEggscapeTeaser component ───────────────────────── */

export function GreatEggscapeTeaser() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fdf9ed 0%, #fffbeb 50%, #fef3c7 100%)",
        }}
      />

      {/* Subtle accent blobs */}
      <div
        className="absolute -right-[10%] top-[20%] h-[300px] w-[300px] rounded-full opacity-15 blur-[80px]"
        style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
      />
      <div
        className="absolute -left-[10%] bottom-[10%] h-[250px] w-[250px] rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Bouncing egg */}
          <motion.span
            className="mb-6 text-5xl"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          >
            🥚
          </motion.span>

          {/* Heading with gradient text */}
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">
            <span className="bg-gradient-to-r from-terra-500 to-yolk-500 bg-clip-text text-transparent">
              Play the Great Eggscape
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-md text-stone-600">
            Hatch an egg, reveal a discount. It&apos;s our way of saying thanks!
          </p>

          {/* CTA button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              href="/register"
              className="inline-block rounded-full bg-green-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700 hover:shadow-xl active:scale-[0.97]"
            >
              Join Beta to Play
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
