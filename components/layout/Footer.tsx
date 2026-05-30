import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const footerLinks = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Site-wide footer with branding, navigation links, social placeholders,
 * and copyright notice.
 */
export function Footer() {
  return (
    <footer className="bg-cream-100 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Logo />
            <p className="text-sm text-stone-500">
              Farm-to-table egg delivery
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-600 transition-colors hover:text-green-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social placeholder icons */}
          <div className="flex gap-4" aria-label="Social media links">
            {["Twitter", "Instagram", "Facebook"].map((name) => (
              <span
                key={name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-xs text-stone-500 transition-colors hover:bg-green-100 hover:text-green-600"
                title={name}
              >
                {name.charAt(0)}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          &copy; 2026 FreshFarm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
