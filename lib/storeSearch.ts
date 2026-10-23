import type { StoreSort } from "@/types/product";

/** Sort choices on the search page; the first one is the default. */
export const STORE_SORT_OPTIONS: { value: StoreSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "lowest-price", label: "Lowest Price" },
  { value: "highest-price", label: "Highest Price" },
  { value: "popularity", label: "Popularity" },
];

/** "Load more" grows the list one page at a time, up to this many pages. */
export const MAX_SEARCH_PAGES = 20;

/** The search page state, all of it kept in the URL so it survives refresh and sharing. */
export type StoreSearch = {
  searchTerm?: string;
  category?: string;
  sort: StoreSort;
  /** How many pages are shown. */
  page: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;

const isSort = (value: string | undefined): value is StoreSort =>
  STORE_SORT_OPTIONS.some((option) => option.value === value);

/** Reads only the known params; anything else in the URL is ignored. */
export function parseStoreSearch(params: RawSearchParams): StoreSearch {
  const sort = first(params.sort);
  const page = Number(first(params.page));

  return {
    searchTerm: first(params.searchTerm)?.slice(0, 100),
    category: first(params.category),
    sort: isSort(sort) ? sort : STORE_SORT_OPTIONS[0].value,
    page: Number.isInteger(page) && page > 1 ? Math.min(page, MAX_SEARCH_PAGES) : 1,
  };
}

/**
 * Link to the search page with some values changed. Changing anything but
 * the page starts the list from the top again.
 */
export function searchHref(current: StoreSearch, changes: Partial<StoreSearch>) {
  const next = { ...current, page: 1, ...changes };
  const params = new URLSearchParams();
  if (next.searchTerm) params.set("searchTerm", next.searchTerm);
  if (next.category) params.set("category", next.category);
  if (next.sort !== STORE_SORT_OPTIONS[0].value) params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}
