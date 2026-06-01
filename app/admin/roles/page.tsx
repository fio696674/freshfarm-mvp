"use client";

import { useState, useEffect } from "react";
import { Shield, User, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateUserRole, isCurrentUserAdmin } from "@/actions/admin";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  full_name: string;
  role: "customer" | "admin" | "driver";
  created_at: string;
}

const roleOptions = [
  { value: "customer" as const, label: "Customer", icon: User, color: "bg-green-100 text-green-700", description: "Regular shopper" },
  { value: "admin" as const, label: "Admin", icon: Shield, color: "bg-blue-100 text-blue-700", description: "Full admin access" },
  { value: "driver" as const, label: "Driver", icon: Truck, color: "bg-violet-100 text-violet-700", description: "Delivery driver" },
];

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
      const adminCheck = await isCurrentUserAdmin();
      setIsAdmin(adminCheck);
      if (adminCheck) {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Failed to fetch users:", error);
        } else {
          setUsers(profiles || []);
        }
      }
      setLoading(false);
    });
  }, []);

  async function handleRoleChange(userId: string, newRole: "customer" | "admin" | "driver") {
    setSaving(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(result.message);
    }
    setSaving(null);
  }

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-stone-50 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <Shield className="mx-auto mb-3 size-12 text-red-400" />
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="mt-2 text-sm text-red-600">Only admins can manage roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage user roles. Only admins can change roles.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.value} className="rounded-2xl border border-stone-100 bg-white p-5">
              <div className={cn("mb-3 inline-flex size-10 items-center justify-center rounded-xl", role.color)}>
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-stone-900">{role.label}</h3>
              <p className="mt-1 text-xs text-stone-500">{role.description}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Current Role</th>
              <th className="px-6 py-3">Change Role</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-stone-400">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-stone-400">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-stone-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                        <User className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900">{user.full_name ?? "—"}</p>
                        {user.id === currentUserId && <p className="text-xs text-green-600">(You)</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", roleOptions.find(r => r.value === user.role)?.color ?? "bg-stone-100 text-stone-600")}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {roleOptions.map((role) => {
                        const isCurrentRole = user.role === role.value;
                        const isYou = user.id === currentUserId;
                        return (
                          <button
                            key={role.value}
                            onClick={() => !isCurrentRole && handleRoleChange(user.id, role.value)}
                            disabled={isCurrentRole || saving === user.id || isYou}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                              isCurrentRole ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                                : isYou ? "bg-stone-50 text-stone-400 cursor-not-allowed"
                                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                            )}
                            title={isYou ? "You cannot change your own role" : ""}
                          >
                            {saving === user.id ? "..." : role.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                    {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
