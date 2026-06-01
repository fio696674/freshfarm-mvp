"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RewardDisplay } from "./RewardDisplay";
import { createClient } from "@/lib/supabase/client";

type GameState = "idle" | "cracking" | "hatched";

interface CampaignReward {
  code: string;
  discount_pct: number;
}

export function EggHatchGame() {
  const [state, setState] = useState<GameState>("idle");
  const [reward, setReward] = useState<CampaignReward>({
    code: "FRESH10",
    discount_pct: 10,
  });

  async function handleTap() {
    if (state !== "idle") return;
    setState("cracking");

    // Look up an active campaign while the animation plays
    try {
      const supabase = createClient();
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (campaign) {
        setReward({
          code: campaign.code,
          discount_pct: campaign.discount_pct,
        });
      } else {
        setReward({ code: "FRESH10", discount_pct: 10 });
      }

      // Log the game play
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const campaignCode = campaign?.code ?? "FRESH10";
        await supabase.from("ugc_submissions").insert({
          user_id: user.id,
          image_url: "game_play",
          caption: `Played Great Eggscape - won ${campaignCode}`,
        });
      }
    } catch {
      // campaigns table may not exist; fall back to default reward
      setReward({ code: "FRESH10", discount_pct: 10 });
    }

    // Reveal the chick after the cracking animation
    setTimeout(() => {
      setState("hatched");
    }, 800);
  }

  function handlePlayAgain() {
    setState("idle");
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="egg"
            onClick={handleTap}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="cursor-pointer select-none text-9xl leading-none transition-transform"
            aria-label="Tap to hatch the egg"
          >
            🥚
          </motion.button>
        )}

        {state === "cracking" && (
          <motion.div
            key="cracking"
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              rotate: [0, -5, 5, -3, 3, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-9xl leading-none"
          >
            🥚
          </motion.div>
        )}

        {state === "hatched" && (
          <motion.div
            key="chick"
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
              mass: 0.8,
            }}
            className="flex flex-col items-center gap-6"
          >
            <span className="text-9xl leading-none">🐣</span>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <RewardDisplay code={reward.code} discountPct={reward.discount_pct} />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handlePlayAgain}
              className="mt-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "idle" && (
        <p className="text-sm text-stone-400">Tap the egg to hatch it!</p>
      )}
    </div>
  );
}
