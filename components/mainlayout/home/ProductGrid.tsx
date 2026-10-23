import Link from "next/link";

import ProductCard from "@/components/mainlayout/home/ProductCard";
import SectionHeader from "@/components/mainlayout/home/SectionHeader";
import Container from "@/components/mainlayout/layout/Container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";

type ProductGridProps = {
  title: string;
  description: string;
  products: Product[];
  /** "View all" link under the grid. */
  viewAllHref?: string;
};

const GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-5";

const ProductGrid = ({ title, description, products, viewAllHref }: ProductGridProps) => {
  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <SectionHeader title={title} description={description} />
      <div className={GRID_CLASS}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {viewAllHref && (
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href={viewAllHref}>View all products</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

/** Same shape as the grid, shown while its products load. */
export const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <Container className="mb-12 lg:mb-14 xl:mb-16" aria-busy="true" aria-label="Loading products">
    <div className="mb-5 flex flex-col items-center gap-3 pb-2 xl:mb-6">
      <Skeleton className="h-7 w-72" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
    <div className={GRID_CLASS}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-md p-3 shadow-sm">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </Container>
);

export default ProductGrid;
