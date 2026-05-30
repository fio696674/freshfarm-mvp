"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

/* ── BetaSignup component ───────────────────────────────── */

export function BetaSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section heading */}
          <h2 className="text-3xl font-light tracking-tight text-stone-900 md:text-4xl">
            Join the Beta
          </h2>
          <p className="mx-auto mt-4 max-w-md text-stone-500">
            Be among the first to get farm-fresh eggs delivered to your door
          </p>

          {/* Email form */}
          <div className="mt-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-green-200 bg-green-50 p-6"
              >
                <p className="text-lg font-medium text-green-700">
                  You&apos;re on the list! 🎉
                </p>
                <p className="mt-1 text-sm text-green-600">
                  We&apos;ll notify you when we launch in your area.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:justify-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-full border border-stone-200 bg-white px-6 py-3 text-sm text-stone-900 shadow-sm outline-none transition-shadow placeholder:text-stone-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 sm:w-80"
                />
                <button
                  type="submit"
                  className="rounded-full bg-green-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 active:scale-[0.97]"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>

          {/* Delivery zone info */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-2 text-sm text-stone-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <MapPin className="h-4 w-4 text-terra-500" strokeWidth={1.5} />
            <span>Currently serving Orlando &amp; Miami</span>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            className="mx-auto mt-8 h-40 max-w-md overflow-hidden rounded-2xl border border-stone-100"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #e0f2fe 0%, #d1fae5 40%, #fef3c7 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-2 text-stone-500">
                <MapPin className="h-8 w-8 text-terra-400" strokeWidth={1.5} />
                <span className="text-xs font-medium">
                  Orlando &amp; Miami — Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
