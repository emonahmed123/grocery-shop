import { X } from "lucide-react";
import Link from "next/link";

import CategoryFilter from "@/components/mainlayout/search/CategoryFilter";
import { type StoreSearch, searchHref } from "@/lib/storeSearch";
import { getStoreCategories } from "@/services/category.services";
import type { Category } from "@/types/category";

const findCategoryName = (categories: Category[], slug: string) =>
  categories.flatMap((category) => [category, ...(category.children ?? [])]).find((item) => item.slug === slug)
    ?.name ?? slug;

const FilterChip = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    aria-label={`Remove ${label} filter`}
    className="inline-flex max-w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-brand"
  >
    <span className="truncate">{label}</span>
    <X className="size-3.5 shrink-0 text-muted-foreground" />
  </Link>
);

const SearchSidebar = async ({ search }: { search: StoreSearch }) => {
  const categories = await getStoreCategories();
  const hasFilters = Boolean(search.searchTerm || search.category);

  return (
    <aside className="flex flex-col gap-10">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Filters</h3>
          {hasFilters && (
            <Link
              href={searchHref(search, { searchTerm: undefined, category: undefined })}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear All
            </Link>
          )}
        </div>
        {hasFilters ? (
          <div className="flex flex-wrap gap-2">
            {search.searchTerm && (
              <FilterChip label={`"${search.searchTerm}"`} href={searchHref(search, { searchTerm: undefined })} />
            )}
            {search.category && (
              <FilterChip label={findCategoryName(categories, search.category)} href={searchHref(search, { category: undefined })} />
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Showing every product.</p>
        )}
      </div>

      <CategoryFilter categories={categories} search={search} />
    </aside>
  );
};

export default SearchSidebar;
