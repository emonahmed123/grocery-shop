import { queryOptions } from "@tanstack/react-query";

import { getDashboardStatsAction } from "@/actions/dashboard.actions";
import { dashboardKeys } from "@/queries/queryKeys";
import { unwrapResult } from "@/queries/unwrapResult";

export const dashboardStatsQuery = queryOptions({
  queryKey: dashboardKeys.stats,
  queryFn: () => unwrapResult(getDashboardStatsAction()),
});
