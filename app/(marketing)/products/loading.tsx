import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="space-y-3">
        <div className="h-10 w-48 rounded-md bg-stone-100 animate-pulse" />
        <div className="h-5 w-72 rounded-md bg-stone-100 animate-pulse" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
