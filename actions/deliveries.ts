"use server";

/**
 * Assigns a delivery to a driver with a specified vehicle type.
 * This is a stub that logs the assignment and returns success.
 * Will be connected to Supabase in a future task.
 */
export async function assignDelivery(
  orderId: string,
  vehicleType: string,
  driverName: string
): Promise<{ success: boolean; message: string }> {
  console.log(
    `[Delivery Assignment] Order: ${orderId}, Vehicle: ${vehicleType}, Driver: ${driverName}`
  );

  // Simulate a brief delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: `Delivery for ${orderId} assigned to ${driverName} (${vehicleType}).`,
  };
}
