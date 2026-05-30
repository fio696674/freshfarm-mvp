"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "How It Works", href: "/how-it-works" },
];

const authLinks = [
  { label: "Login", href: "/login" },
  { label: "Order Now", href: "/register" },
];

/**
 * Full-screen mobile navigation overlay with a slide-in panel from the right.
 * Closes on: X button, link click, or backdrop click.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex h-full flex-col p-6">
              {/* Close button */}
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Navigation links */}
              <motion.nav
                className="flex flex-1 flex-col gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`block rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-green-50 text-green-700"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Auth actions */}
              <motion.div
                className="flex flex-col gap-3 border-t border-stone-100 pt-6"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {authLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`block rounded-lg px-4 py-3 text-center text-lg font-medium transition-colors ${
                        link.href === "/register"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "border border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
