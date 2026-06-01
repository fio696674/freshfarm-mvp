"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Megaphone,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Deliveries", href: "/admin/deliveries", icon: Truck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Roles", href: "/admin/roles", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r border-stone-100 bg-white p-4 lg:block">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-4 border-green-600 bg-green-50 text-green-700"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
