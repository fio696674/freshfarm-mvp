"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "How It Works", href: "/how-it-works" },
];

/**
 * Sticky header with frosted-glass effect.
 * Detects scroll via Framer Motion's useScroll to reduce padding and add shadow.
 * Includes hamburger menu for mobile navigation.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  return (
    <>
      <motion.header
        className="sticky top-0 z-30 border-b border-stone-100 bg-white/80 backdrop-blur-xl"
        animate={{
          paddingTop: scrolled ? "0.5rem" : "1rem",
          paddingBottom: scrolled ? "0.5rem" : "1rem",
        }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: scrolled
            ? "0 1px 3px 0 rgb(0 0 0 / 0.1)"
            : "0 0 0 0 rgb(0 0 0 / 0)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left — Logo */}
          <Logo />

          {/* Center — Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  pathname === link.href
                    ? "text-green-600"
                    : "text-stone-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — Auth actions + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-green-600 sm:block"
            >
              Login
            </Link>
            <Link href="/register" className="hidden sm:block">
              <Button size="default">Order Now</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
