import type { Metadata } from "next";
import { Egg } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fresh Farm - Authentication",
};

/**
 * Auth layout — centered card with branding.
 * Used by /login and /register pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <Egg className="size-6 text-primary" />
            <span>Fresh Farm</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Farm-to-table egg delivery
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
