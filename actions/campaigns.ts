"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Records a game completion event for a user.
 * In production, this would write to a campaigns/events table.
 */
export async function recordGamePlay(
  userId: string,
  gameId: string,
  rewardCode: string
): Promise<{ success: boolean; message: string }> {
  console.log(
    `[Campaign] User: ${userId}, Game: ${gameId}, Reward: ${rewardCode}`
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  // Stub: log and return success
  return {
    success: true,
    message: `Reward ${rewardCode} recorded for user.`,
  };
}

/**
 * Validates whether a user is eligible to play the game.
 */
export async function checkGameEligibility(
  userId: string,
  gameId: string
): Promise<{ eligible: boolean; reason?: string }> {
  // Stub: everyone is eligible
  return { eligible: true };
}
