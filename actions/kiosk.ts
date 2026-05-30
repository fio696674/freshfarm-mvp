"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Verifies a QR token for kiosk pickup.
 * In production, this would validate the token against the database,
 * mark the order as picked up, and open the smart locker.
 */
export async function verifyKioskPickup(
  qrToken: string,
  lockerId: string
): Promise<{ success: boolean; message: string; orderId?: string }> {
  console.log(
    `[Kiosk Pickup] Token: ${qrToken}, Locker: ${lockerId}`
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required to verify pickup.",
    };
  }

  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Stub: always return success for demo
  return {
    success: true,
    message: "Pickup verified successfully! Locker opened.",
    orderId: `order_${Date.now().toString(36)}`,
  };
}
