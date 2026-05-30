import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock_qty?: number;
};

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
