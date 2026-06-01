"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

const roleBadge: Record<string, string> = {
  customer: "bg-green-100 text-green-700",
  admin: "bg-blue-100 text-blue-700",
  driver: "bg-violet-100 text-violet-700",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Failed to fetch customers:", error);
        setLoading(false);
        return;
      }

      setCustomers(
        data.map((p) => ({
          id: p.id,
          full_name: p.full_name ?? "—",
          role: p.role ?? "customer",
          created_at: p.created_at,
        }))
      );
      setLoading(false);
    }

    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Customers</h1>
        <p className="mt-1 text-sm text-stone-500">
          View and manage registered customers.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-sm text-stone-400">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-sm text-stone-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-stone-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <User className="size-4" />
                      </div>
                      <span className="text-sm font-medium text-stone-900">
                        {customer.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        roleBadge[customer.role] ?? "bg-stone-100 text-stone-600"
                      )}
                    >
                      {customer.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                    {new Date(customer.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
