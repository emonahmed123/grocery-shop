import { dehydrate, type FetchQueryOptions, HydrationBoundary, QueryClient } from "@tanstack/react-query";

// Each query has its own data type; only the key and fetcher matter here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrefetchOptions = FetchQueryOptions<any, any, any, any>;

/**
 * Loads the given queries on the server and hands them to the client cache,
 * so tables render with data on the first paint. Failures are left for the
 * client hooks to retry and report.
 */
const PrefetchBoundary = async ({
  queries,
  children,
}: {
  queries: PrefetchOptions[];
  children: React.ReactNode;
}) => {
  const queryClient = new QueryClient();
  await Promise.all(queries.map((query) => queryClient.prefetchQuery(query)));

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};

export default PrefetchBoundary;
