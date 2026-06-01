"use server";

import { createClient } from "@/lib/supabase/server";

export async function assignDelivery(
  orderId: string,
  vehicleType: string,
  driverName: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Not authenticated" };

  const { error: deliveryError } = await supabase.from("deliveries").insert({
    order_id: orderId,
    driver_id: user.id,
    vehicle_type: vehicleType,
    status: "assigned",
  });

  if (deliveryError) {
    return { success: false, message: deliveryError.message };
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "preparing" })
    .eq("id", orderId);

  if (orderError) {
    return { success: false, message: orderError.message };
  }

  return {
    success: true,
    message: `Delivery for ${orderId} assigned to ${driverName} (${vehicleType}).`,
  };
}
