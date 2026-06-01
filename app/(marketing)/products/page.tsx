"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { createClient } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-4xl font-light text-stone-900">Our Eggs</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="mb-8 text-4xl font-light text-stone-900">Our Eggs</h1>
      <ProductGrid products={products} />
    </section>
  );
}
