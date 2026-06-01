"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface RewardDisplayProps {
  code: string;
  discountPct?: number;
}

export function RewardDisplay({ code, discountPct = 10 }: RewardDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 px-8 py-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
        You earned a discount!
      </p>
      <p className="mt-2 text-3xl font-bold tracking-widest text-stone-900">
        {code}
      </p>
      <p className="mt-1 text-xs text-stone-500">{discountPct}% off your next order</p>

      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600 active:bg-amber-700"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy Code
          </>
        )}
      </button>
    </div>
  );
}
