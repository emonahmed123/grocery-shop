import type { Metadata } from "next";
import { Suspense } from "react";

import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Container from "@/components/mainlayout/layout/Container";
import SearchResults, { SearchResultsSkeleton } from "@/components/mainlayout/search/SearchResults";
import SearchSidebar from "@/components/mainlayout/search/SearchSidebar";
import SearchToolbar from "@/components/mainlayout/search/SearchToolbar";
import { parseStoreSearch } from "@/lib/storeSearch";

export const metadata: Metadata = {
  title: "Search Products | BoroBazar",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = parseStoreSearch(await searchParams);
  // A new search, filter or sort shows the skeleton; "Load more" keeps the
  // current list on screen until the longer one arrives.
  const resultsKey = JSON.stringify({ ...search, page: undefined });

  return (
    <>
      <Container className="flex pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="hidden w-80 shrink-0 pr-8 lg:block xl:w-96 xl:pr-16">
          <SearchSidebar search={search} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Re-keyed so the mobile filter drawer closes after a filter is picked. */}
          <SearchToolbar key={`toolbar-${resultsKey}`} search={search} filters={<SearchSidebar search={search} />} />
          <Suspense key={`results-${resultsKey}`} fallback={<SearchResultsSkeleton />}>
            <SearchResults search={search} />
          </Suspense>
        </div>
      </Container>
      <DownloadApp />
    </>
  );
}
