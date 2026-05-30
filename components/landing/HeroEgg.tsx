"use client";

import { motion } from "framer-motion";

/**
 * Premium CSS-only egg hero element with organic shapes,
 * ambient glow, and floating animation.
 * Serves as a visually compelling fallback for a Spline 3D scene.
 */
export function HeroEgg() {
  return (
    <motion.div
      className="relative flex h-[400px] w-full items-center justify-center md:h-[500px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow — pulsing radial gradient behind the egg */}
      <motion.div
        className="absolute h-[360px] w-[360px] rounded-full md:h-[440px] md:w-[440px]"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.08) 40%, rgba(251,191,36,0) 70%)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shadow — ellipse below the egg that moves with the float */}
      <motion.div
        className="absolute bottom-[60px] h-[16px] w-[180px] rounded-[50%] bg-stone-900/[0.06] blur-[10px] md:bottom-[70px] md:w-[200px]"
        animate={{ scaleX: [1, 0.92, 1] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Egg container — floating animation */}
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Egg shape */}
        <div
          className="relative h-[260px] w-[200px] md:h-[320px] md:w-[240px]"
          style={{
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background:
              "linear-gradient(165deg, #fefcf3 0%, #fdf6de 25%, #faecc0 55%, #f5e3a5 85%, #f0d888 100%)",
            boxShadow: `
              0 25px 60px -12px rgba(180,130,30,0.15),
              0 12px 28px -8px rgba(180,130,30,0.1),
              inset 0 -4px 12px rgba(180,130,30,0.06),
              inset 0 4px 8px rgba(255,255,255,0.8)
            `,
          }}
        >
          {/* Surface highlight — top-left specular reflection */}
          <div
            className="absolute left-[18%] top-[12%] h-[38%] w-[50%] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(-18deg)",
            }}
          />

          {/* Secondary highlight — subtle warm reflection */}
          <div
            className="absolute left-[10%] top-[28%] h-[20%] w-[35%] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,248,230,0.8) 0%, transparent 65%)",
              transform: "rotate(-25deg)",
            }}
          />

          {/* Bottom shadow — ambient occlusion at the base */}
          <div
            className="absolute bottom-[4%] left-[15%] h-[18%] w-[70%] rounded-[50%] opacity-40"
            style={{
              background:
                "radial-gradient(ellipse, rgba(160,120,40,0.15) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Tiny floating particles for organic feel */}
        <motion.div
          className="absolute -left-4 top-[30%] h-1.5 w-1.5 rounded-full bg-yolk-300/60"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute -right-6 top-[50%] h-1 w-1 rounded-full bg-terra-300/50"
          animate={{
            y: [0, -16, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.div
          className="absolute -left-8 bottom-[25%] h-[5px] w-[5px] rounded-full bg-yolk-200/50"
          animate={{
            y: [0, -24, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>
    </motion.div>
  );
}
