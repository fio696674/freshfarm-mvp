"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Egg, MapPin, Smartphone } from "lucide-react";

/* ── Framer Motion variants ─────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

/* ── Counter hook ──────────────────────────────────────── */

function useCountUp(target: number, duration = 2000): [number, (start: boolean) => void] {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(false);

  const start = (shouldStart: boolean) => {
    if (!shouldStart || startRef.current) return;
    startRef.current = true;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad for natural feel
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [count, start];
}

/* ── Card data ─────────────────────────────────────────── */

const valueProps: Array<{
  icon: typeof Egg;
  title: string;
  description: string;
  counter: boolean;
  counterTarget: number;
  iconColor: string;
  iconBg: string;
}> = [
  {
    icon: Egg,
    title: "Less than 10 Days Old",
    description:
      "Every egg is guaranteed under 10 days from lay to delivery. Peak freshness you can taste.",
    counter: true,
    counterTarget: 10,
    iconColor: "text-yolk-600",
    iconBg: "bg-yolk-50",
  },
  {
    icon: MapPin,
    title: "2–5 Mile Delivery",
    description:
      "We deliver within a tight local radius, so your eggs never spend hours on the road.",
    counter: false,
    counterTarget: 0,
    iconColor: "text-terra-600",
    iconBg: "bg-terra-50",
  },
  {
    icon: Smartphone,
    title: "QR Kiosk Pickup",
    description:
      "Skip the wait. Scan your QR code at a neighborhood kiosk and grab your eggs instantly.",
    counter: false,
    counterTarget: 0,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
];

/* ── Counter card (animated number) ────────────────────── */

function CounterValue({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, startCount] = useCountUp(target, 2000);

  useEffect(() => {
    startCount(inView);
  }, [inView, startCount]);

  return (
    <div ref={ref} className="flex items-baseline gap-1">
      <span className="text-4xl font-light tabular-nums tracking-tight text-stone-900">
        {count}
      </span>
      <span className="text-sm font-medium text-stone-500">days max</span>
    </div>
  );
}

/* ── ValueProps component ──────────────────────────────── */

export function ValueProps() {
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
            Why Fresh Farm?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            The freshest eggs, delivered the smartest way.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {valueProps.map((prop) => {
            const Icon = prop.icon;

            return (
              <motion.div
                key={prop.title}
                variants={cardVariants}
                className="group rounded-2xl border border-stone-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Icon */}
                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${prop.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${prop.iconColor}`} strokeWidth={1.5} />
                </div>

                {/* Counter or title */}
                {prop.counter ? (
                  <CounterValue target={prop.counterTarget} />
                ) : (
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-stone-900">
                    {prop.title}
                  </h3>
                )}

                {/* Description */}
                <p className="mt-2 leading-relaxed text-stone-500">
                  {prop.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
