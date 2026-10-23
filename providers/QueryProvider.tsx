"use client";

import {
  defaultShouldDehydrateQuery,
  isServer,
  type Query,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // Keep data fresh for a minute so remounts and tab switches do not refetch.
      queries: { staleTime: 60 * 1000 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// Hashes of the queries each server client fetched itself (useSuspenseQuery
// during SSR). Queries a HydrationBoundary put in the cache are already in the
// RSC payload, so only these are streamed, or prefetched data is sent twice.
const serverFetchedQueries = new WeakMap<QueryClient, Set<string>>();

function trackServerFetches(queryClient: QueryClient) {
  const fetched = new Set<string>();
  queryClient.getQueryCache().subscribe((event) => {
    // hydrate() only adds queries or sets their state; a real fetch ends in "success".
    if (event.type === "updated" && event.action.type === "success") {
      fetched.add(event.query.queryHash);
    }
  });
  serverFetchedQueries.set(queryClient, fetched);
  return queryClient;
}

// The server needs a fresh client per request so users never share cache. The
// browser keeps one client for the whole session, even if React suspends and
// throws away the first render.
function getQueryClient() {
  if (isServer) return trackServerFetches(makeQueryClient());
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const shouldDehydrateQuery = (query: Query) =>
    Boolean(serverFetchedQueries.get(queryClient)?.has(query.queryHash)) &&
    defaultShouldDehydrateQuery(query);

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        Prefetch + HydrationBoundary stays the main pattern. This also lets a
        Client Component call useSuspenseQuery with no prefetch: it fetches during
        SSR and the result is streamed in. Wrap those in <Suspense> or the page
        waits for the fetch before sending any HTML.
      */}
      <ReactQueryStreamedHydration options={{ dehydrate: { shouldDehydrateQuery } }}>
        {children}
      </ReactQueryStreamedHydration>
      {/* The floating TanStack logo (bottom-right) opens the cache inspector; dev only. */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
