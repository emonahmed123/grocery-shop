import { PageHeaderSkeleton, TableSkeleton } from "@/components/dashboard/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <TableSkeleton columns={4} withAction />
    </>
  );
}
