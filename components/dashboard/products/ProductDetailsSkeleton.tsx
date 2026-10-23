import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder with the same shape as the product details page. */
const ProductDetailsSkeleton = () => (
  <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading product">
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-28" />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-3 lg:col-span-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="size-16" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  </div>
);

export default ProductDetailsSkeleton;
