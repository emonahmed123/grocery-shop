import { queryOptions } from "@tanstack/react-query";

import { getAdminCategoriesAction, getCategoriesAction } from "@/actions/dashboard.actions";
import { dashboardKeys } from "@/queries/queryKeys";
import { unwrapResult } from "@/queries/unwrapResult";

export const categoriesQuery = queryOptions({
  queryKey: dashboardKeys.categories,
  queryFn: () => unwrapResult(getCategoriesAction()),
  staleTime: 10 * 60 * 1000,
});

/** Only the categories saved in the backend, for the categories page. */
export const adminCategoriesQuery = queryOptions({
  queryKey: dashboardKeys.adminCategories,
  queryFn: () => unwrapResult(getAdminCategoriesAction()),
});
