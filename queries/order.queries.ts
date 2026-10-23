import { queryOptions } from "@tanstack/react-query";

import { getAllOrdersAction } from "@/actions/dashboard.actions";
import { dashboardKeys } from "@/queries/queryKeys";
import { unwrapResult } from "@/queries/unwrapResult";

export const adminOrdersQuery = queryOptions({
  queryKey: dashboardKeys.orders,
  queryFn: () => unwrapResult(getAllOrdersAction()),
});
