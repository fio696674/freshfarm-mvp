import { Skeleton } from "@/components/ui/skeleton";

/* ──────────────────────────────────────────────────────────────
 * ProductCardSkeleton – shimmer card matching ProductCard
 * ────────────────────────────────────────────────────────────── */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none bg-stone-100" />
      </div>

      {/* Content placeholder */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-stone-100 rounded-md" />
          <Skeleton className="h-4 w-full bg-stone-100 rounded-md" />
          <Skeleton className="h-4 w-2/3 bg-stone-100 rounded-md" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 bg-stone-100 rounded-md" />
          <Skeleton className="h-9 w-28 bg-stone-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * OrderCardSkeleton – shimmer matching OrderCard
 * ────────────────────────────────────────────────────────────── */

export function OrderCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-4">
      <div className="flex items-center gap-4">
        {/* Status badge placeholder */}
        <Skeleton className="h-6 w-20 bg-stone-100 rounded-full" />

        {/* Order info placeholder */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 bg-stone-100 rounded-md" />
          <Skeleton className="h-3 w-32 bg-stone-100 rounded-md" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-14 bg-stone-100 rounded-md" />
        <Skeleton className="h-4 w-20 bg-stone-100 rounded-md" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * DashboardSkeleton – combined layout skeleton
 * ────────────────────────────────────────────────────────────── */

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Welcome section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-stone-100 rounded-md" />
        <Skeleton className="h-4 w-48 bg-stone-100 rounded-md" />
      </div>

      {/* Upcoming deliveries */}
      <section className="space-y-4">
        <Skeleton className="h-5 w-40 bg-stone-100 rounded-md" />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </section>

      {/* Recent orders */}
      <section className="space-y-4">
        <Skeleton className="h-5 w-36 bg-stone-100 rounded-md" />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <Skeleton className="h-5 w-32 bg-stone-100 rounded-md" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-12 w-40 bg-stone-100 rounded-xl" />
          <Skeleton className="h-12 w-40 bg-stone-100 rounded-xl" />
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * AdminDashboardSkeleton
 * ────────────────────────────────────────────────────────────── */

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 bg-stone-100 rounded-md" />
        <Skeleton className="h-4 w-64 bg-stone-100 rounded-md" />
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 bg-stone-100 rounded-2xl" />
        ))}
      </div>

      {/* Table placeholder */}
      <Skeleton className="h-80 bg-stone-100 rounded-2xl" />
    </div>
  );
}
