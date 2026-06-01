"use server";
import { createClient } from "@/lib/supabase/server";

/**
 * Check if current user is an admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  return profile?.role === "admin";
}

/**
 * Update a user's role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: "customer" | "admin" | "driver"
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };
  
  // Check if current user is admin
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (adminProfile?.role !== "admin") {
    return { success: false, message: "Only admins can change roles" };
  }
  
  // Prevent admin from removing their own admin role
  if (userId === user.id && newRole !== "admin") {
    return { success: false, message: "Cannot remove your own admin role" };
  }
  
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);
  
  if (error) {
    return { success: false, message: error.message };
  }
  
  return { success: true, message: `Role updated to ${newRole}` };
}
