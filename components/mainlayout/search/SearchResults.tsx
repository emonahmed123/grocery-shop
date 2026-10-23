import { SearchX } from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/mainlayout/home/ProductCard";
import LoadMoreLink from "@/components/mainlayout/search/LoadMoreLink";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { MAX_SEARCH_PAGES, type StoreSearch, searchHref } from "@/lib/storeSearch";
import { getProducts, STORE_PAGE_SIZE } from "@/services/product.services";
import type { Paginated } from "@/types/api.types";
import type { Product } from "@/types/product";

const GRID_CLASS = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:gap-5";

/**
 * "Load more" asks for every shown page in one request (page 1 with a bigger
 * limit), so a shared or refreshed link shows the same list.
 */
const SearchResults = async ({ search }: { search: StoreSearch }) => {
  let result: Paginated<Product>;
  try {
    result = await getProducts({
      searchTerm: search.searchTerm,
      category: search.category,
      sort: search.sort,
      page: 1,
      limit: STORE_PAGE_SIZE * search.page,
    });
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(error, "Products could not be loaded")}</AlertDescription>
      </Alert>
    );
  }

  const { data: products, meta } = result;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border px-6 py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-semibold text-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try another word or remove a filter.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/search">See all products</Link>
        </Button>
      </div>
    );
  }

  const hasMore = products.length < meta.total && search.page < MAX_SEARCH_PAGES;

  return (
    <>
      <p className="mb-4 text-sm font-semibold text-foreground md:text-base" aria-live="polite">
        {meta.total.toLocaleString("en-US")} {meta.total === 1 ? "Item" : "Items"} Found
      </p>
      <div className={GRID_CLASS}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-2 lg:mt-12">
        {hasMore ? (
          <LoadMoreLink href={searchHref(search, { page: search.page + 1 })} />
        ) : (
          <p className="text-sm text-muted-foreground">You have seen all {meta.total} products.</p>
        )}
      </div>
    </>
  );
};

export const SearchResultsSkeleton = () => (
  <div aria-busy="true" aria-label="Loading products">
    <Skeleton className="mb-4 h-5 w-32" />
    <div className={GRID_CLASS}>
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-md p-3 shadow-sm">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export default SearchResults;
