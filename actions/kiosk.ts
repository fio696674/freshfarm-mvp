"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Verifies a QR token for kiosk pickup.
 * Validates the token against the orders table, records the pickup
 * in kiosk_pickups, and marks the order as delivered.
 */
export async function verifyKioskPickup(
  qrToken: string,
  lockerId: string
): Promise<{ success: boolean; message: string; orderId?: string }> {
  const supabase = await createClient();

  // Find order by QR token
  const { data: order, error: lookupError } = await supabase
    .from("orders")
    .select("id, status, user_id")
    .eq("qr_code_token", qrToken)
    .single();

  if (lookupError || !order) {
    return { success: false, message: "Invalid QR code" };
  }

  if (order.status === "delivered" || order.status === "cancelled") {
    return { success: false, message: `Order already ${order.status}` };
  }

  // Record the pickup event
  const { error: pickupError } = await supabase.from("kiosk_pickups").insert({
    order_id: order.id,
    locker_id: lockerId,
    qr_scanned_at: new Date().toISOString(),
    verified: true,
    picked_up_at: new Date().toISOString(),
  });

  if (pickupError) {
    console.error("Failed to record pickup:", pickupError.message);
    return { success: false, message: "Failed to record pickup event" };
  }

  // Update order status to delivered
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", order.id);

  if (updateError) {
    console.error("Failed to update order status:", updateError.message);
    return { success: false, message: "Pickup recorded but failed to update order status" };
  }

  return { success: true, message: "Pickup verified successfully", orderId: order.id };
}
