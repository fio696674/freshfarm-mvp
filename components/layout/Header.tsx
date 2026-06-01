'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, User, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { MobileNav } from "./MobileNav";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/stores/cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "How It Works", href: "/how-it-works" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const itemCount = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        const avatar = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null;
        setAvatarUrl(avatar);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
          setAvatarUrl(avatar);
        } else {
          setUser(null);
          setAvatarUrl(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <motion.header
        className="sticky top-0 z-30 border-b border-stone-100 bg-white/80 backdrop-blur-xl"
        animate={{ paddingTop: scrolled ? "0.5rem" : "1rem", paddingBottom: scrolled ? "0.5rem" : "1rem" }}
        transition={{ duration: 0.2 }}
        style={{ boxShadow: scrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.1)" : "0 0 0 0 rgb(0 0 0 / 0)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === link.href ? "text-green-600" : "text-stone-600"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="size-5 text-stone-600" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terra-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-green-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl ?? undefined} alt="Profile" />
                      <AvatarFallback className="bg-green-100 text-xs font-semibold text-green-700">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-stone-900">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <div className="px-2 pb-1.5 text-xs text-stone-500">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="flex items-center gap-2"><User className="size-4" /> Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/orders" className="flex items-center gap-2"><ShoppingCart className="size-4" /> My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/profile" className="flex items-center gap-2"><User className="size-4" /> Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 focus:text-red-600">
                    <LogOut className="size-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-green-600 sm:block">Login</Link>
                <Link href="/register" className="hidden sm:block"><Button size="default">Order Now</Button></Link>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </motion.header>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} user={user} />
    </>
  );
}
