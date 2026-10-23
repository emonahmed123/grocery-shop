"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { STORE_SORT_OPTIONS, type StoreSearch, searchHref } from "@/lib/storeSearch";
import type { StoreSort } from "@/types/product";

type SearchToolbarProps = {
  search: StoreSearch;
  /** The sidebar filters, shown in a drawer below the `lg` breakpoint. */
  filters: React.ReactNode;
};

const SearchToolbar = ({ search, filters }: SearchToolbarProps) => {
  const router = useRouter();

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* A plain GET form: the search lands in the URL, and Next.js navigates without a reload. */}
      <Form action="/search" className="flex-1" role="search">
        {search.category && <input type="hidden" name="category" value={search.category} />}
        {search.sort !== STORE_SORT_OPTIONS[0].value && <input type="hidden" name="sort" value={search.sort} />}
        <InputGroup className="h-11">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            // Remounts after a search changes in the URL, e.g. when a filter chip removes it.
            key={search.searchTerm ?? ""}
            type="search"
            name="searchTerm"
            defaultValue={search.searchTerm}
            placeholder="Search products, e.g. apple"
            aria-label="Search products"
            maxLength={100}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" variant="brand">
              Search
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Form>

      <div className="flex items-center justify-between gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="sr-only">Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">{filters}</div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground">Sort by:</span>
          <Select
            value={search.sort}
            onValueChange={(sort) => router.push(searchHref(search, { sort: sort as StoreSort }), { scroll: false })}
          >
            <SelectTrigger aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {STORE_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchToolbar;
