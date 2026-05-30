"use client";

import Link from "next/link";
import { use } from "react";

interface OrderConfirmationPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { sessionId } = use(params);
  const { success, demo } = use(searchParams);

  const isDemo = demo === "true" || sessionId.startsWith("cs_demo_");
  const isSuccess = success === "true" || isDemo;

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="rounded-2xl border border-stone-100 bg-white p-8 sm:p-12">
        {/* Success checkmark */}
        {isSuccess && (
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50">
            <svg
              className="size-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        <h1 className="mt-6 text-3xl font-light text-stone-900">
          Order Confirmed!
        </h1>

        <p className="mt-4 text-stone-500">
          Thank you for your order. We&apos;re preparing your farm-fresh eggs
          right now.
        </p>

        {/* Order details */}
        <div className="mt-8 rounded-xl border border-stone-100 bg-stone-50 p-5 text-left">
          <h2 className="text-sm font-semibold text-stone-700">
            Order Details
          </h2>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-stone-500">Order ID</dt>
              <dd className="font-mono text-xs text-stone-700">
                {sessionId}
              </dd>
            </div>
            {isDemo && (
              <div className="flex justify-between text-sm">
                <dt className="text-stone-500">Status</dt>
                <dd className="font-medium text-green-600">Demo Order</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Demo notice */}
        {isDemo && (
          <p className="mt-4 text-xs text-stone-400">
            This is a demo order. No payment was processed.
          </p>
        )}

        {/* CTA */}
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
