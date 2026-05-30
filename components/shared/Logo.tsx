import Link from "next/link";

/**
 * Brand logo — 🥚 emoji + "FreshFarm" text.
 * Links to the home page.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-xl font-semibold ${className ?? ""}`}
    >
      <span aria-hidden="true">🥚</span>
      <span>FreshFarm</span>
    </Link>
  );
}
