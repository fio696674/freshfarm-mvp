import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-stone-900">
        🥚 Fresh Eggs, <br className="hidden sm:block" />Delivered Daily
      </h1>
      <p className="mb-8 max-w-md text-lg text-stone-600">
        Pasture-raised, farm-fresh eggs delivered straight to your door.
      </p>
      <div className="flex gap-3">
        <Link href="/register">
          <Button size="lg">Order Now</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
