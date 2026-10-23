import { Skeleton } from "@/components/ui/skeleton";

// Route-level placeholders shown by `loading.tsx` while a dashboard page and
// its data load. Each one matches the shape of the page it stands in for.

export const PageHeaderSkeleton = ({ withAction = false }: { withAction?: boolean }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    {withAction && <Skeleton className="h-12 w-40" />}
  </div>
);

export const TableSkeleton = ({
  rows = 8,
  columns = 6,
  withToolbar = true,
  withAction = false,
}: {
  rows?: number;
  columns?: number;
  withToolbar?: boolean;
  /** Room for a toolbar button such as "Add Product". */
  withAction?: boolean;
}) => (
  <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading table">
    {withToolbar && (
      <div className="flex flex-col gap-3 lg:flex-row">
        <Skeleton className="h-12 w-full sm:max-w-xs" />
        <Skeleton className="h-12 w-44" />
        {withAction && <Skeleton className="h-12 w-44 lg:ml-auto" />}
      </div>
    )}
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="flex gap-6 border-b px-4 py-3">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0">
          <Skeleton className="size-11 shrink-0" />
          {Array.from({ length: columns - 1 }, (_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      ))}
      <div className="flex justify-between border-t px-4 py-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-7 w-52" />
      </div>
    </div>
  </div>
);

export const OverviewSkeleton = () => (
  <div aria-busy="true" aria-label="Loading dashboard">
    <PageHeaderSkeleton />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-30 w-full" />
      ))}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <Skeleton className="h-96 w-full xl:col-span-2" />
      <Skeleton className="h-96 w-full" />
    </div>
  </div>
);

export const FormPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading form">
    <PageHeaderSkeleton />
    <div className="flex max-w-3xl flex-col gap-5 rounded-lg border bg-background p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-12 w-56" />
    </div>
  </div>
);
