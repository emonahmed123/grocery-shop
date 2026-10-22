import CategoryFilter from "@/components/mainlayout/search/CategoryFilter";
import OptionFilter from "@/components/mainlayout/search/OptionFilter";
import brandsJson from "@/public/data/brands.json";
import categoriesJson from "@/public/data/categories.json";
import dietaryJson from "@/public/data/dietary.json";
import type { Category, FilterOption } from "@/types/category";
import { X } from "lucide-react";
import Link from "next/link";

type SearchSidebarProps = {
  activeCategory?: string;
};

const SearchSidebar = ({ activeCategory }: SearchSidebarProps) => {
  const categories: Category[] = categoriesJson;
  const dietary: FilterOption[] = dietaryJson;
  const brands: FilterOption[] = brandsJson;
  const activeName = categories.find(
    (category) => category.slug === activeCategory,
  )?.name;

  return (
    <aside className="flex flex-col gap-10">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Filters</h3>
          <Link
            href="/search"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear All
          </Link>
        </div>
        {activeCategory && (
          <Link
            href="/search"
            aria-label={`Remove ${activeName ?? activeCategory} filter`}
            className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm text-foreground capitalize transition-colors hover:border-brand"
          >
            {activeName ?? activeCategory}
            <X className="size-3.5 text-muted-foreground" />
          </Link>
        )}
      </div>

      <CategoryFilter categories={categories} activeSlug={activeCategory} />
      <OptionFilter
        title="Dietary Needs"
        name="dietary"
        options={dietary}
        visibleCount={3}
      />
      <OptionFilter title="Brands" name="brand" options={brands} />
    </aside>
  );
};

export default SearchSidebar;
