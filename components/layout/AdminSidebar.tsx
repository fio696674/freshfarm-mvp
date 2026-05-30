"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Megaphone,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Deliveries", href: "/admin/deliveries", icon: Truck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
];

/**
 * Vertical navigation sidebar for the admin panel.
 * Same layout pattern as Sidebar but with admin-specific routes and icons.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function NavContent() {
    return (
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-l-4 border-green-600 bg-green-50 text-green-700"
                  : "border-l-4 border-transparent text-stone-600 hover:bg-stone-50"
              )}
            >
              <item.icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-stone-100 bg-white md:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          <div className="p-4">
            <Logo />
          </div>
          <NavContent />
        </div>
      </aside>

      {/* Mobile sidebar trigger */}
      <div className="sticky top-0 z-20 flex items-center border-b border-stone-100 bg-white/80 p-3 backdrop-blur-xl md:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label="Open sidebar" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" showCloseButton>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col gap-6 pt-2">
              <Logo />
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-lg font-semibold">Admin</span>
      </div>
    </>
  );
}
