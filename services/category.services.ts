import "server-only";

import { cache } from "react";

import { toImageUrl } from "@/lib/assets";
import { createApiClient } from "@/lib/axios/httpClient";
import demoCategoriesJson from "@/public/data/categories.json";
import type { ApiResponse } from "@/types/api.types";
import type { Category } from "@/types/category";

type BackendCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: { thumbnail?: string; original?: string };
  icon?: string;
  children?: { name: string; slug: string }[];
};

const fromBackend = (category: BackendCategory): Category => {
  const original = toImageUrl(category.image?.original ?? category.image?.thumbnail);
  return {
    id: category._id,
    name: category.name,
    slug: category.slug,
    image: { original, thumbnail: toImageUrl(category.image?.thumbnail) || original },
    icon: toImageUrl(category.icon) || undefined,
    children: (category.children ?? []).map((child) => ({ id: child.slug, ...child })),
  };
};

/** The demo list the store started with, in the same shape. */
export const demoCategories: Category[] = demoCategoriesJson.map((category) => ({
  id: String(category.id),
  name: category.name,
  slug: category.slug,
  image: { thumbnail: toImageUrl(category.image.thumbnail), original: toImageUrl(category.image.original) },
  icon: toImageUrl(category.icon) || undefined,
  children: category.children?.map((child) => ({ id: String(child.id), name: child.name, slug: child.slug })),
}));

/**
 * The store's categories. Once the admin has added any in the dashboard,
 * those are shown; until then the demo list keeps the store browsable.
 * Cached per request, since the home carousel and the search filters both use them.
 */
export const getStoreCategories = cache(async (): Promise<Category[]> => {
  try {
    const response = await createApiClient().get<ApiResponse<BackendCategory[] | null>>("/categories", {
      params: { limit: 100, sort: "name" },
    });
    const categories = response.data.data ?? [];
    if (categories.length > 0) return categories.map(fromBackend);
  } catch {
    // The demo list below keeps the store usable while the backend is away.
  }
  return demoCategories;
});
