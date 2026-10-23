import "server-only";

import { cache } from "react";

import { toImageUrl } from "@/lib/assets";
import { createApiClient } from "@/lib/axios/httpClient";
import type { ApiResponse, Paginated, PaginationMeta } from "@/types/api.types";
import type { Product, ProductFlashSale, StoreProductQuery, StoreSort } from "@/types/product";

// Store pages only read public product data, so no auth cookie is sent.
const PRODUCT_ENDPOINTS = {
  products: "/product",
  flashSale: "/product/flash-sale",
};

/** Products per page on the search page and in each home section. */
export const STORE_PAGE_SIZE = 12;

const SORT_PARAMS: Record<StoreSort, string> = {
  newest: "-createdAt",
  "lowest-price": "price",
  "highest-price": "-price",
  popularity: "-ratingCount,-averageRating",
};

// The backend sends `null` for empty optional fields.
type BackendProduct = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  unit?: string;
  price: number;
  salePrice?: number | null;
  maxPrice?: number | null;
  currentPrice?: number;
  isOnFlashSale?: boolean;
  flashSale?: ProductFlashSale | null;
  description?: string;
  gallery?: string[];
  tags?: string[];
  variations?: { name: string; values: string[] } | null;
  category?: string;
  isAvailable?: boolean;
  inStock?: number | null;
  averageRating?: number;
  ratingCount?: number;
};

const toProduct = (product: BackendProduct): Product => ({
  id: product._id,
  name: product.name,
  slug: product.slug ?? product._id,
  image: toImageUrl(product.image),
  unit: product.unit ?? "",
  price: product.price,
  salePrice: product.salePrice ?? undefined,
  maxPrice: product.maxPrice ?? undefined,
  currentPrice: product.currentPrice ?? product.salePrice ?? product.price,
  isOnFlashSale: product.isOnFlashSale ?? false,
  flashSale: product.flashSale ?? undefined,
  description: product.description,
  gallery: (product.gallery ?? []).map(toImageUrl).filter(Boolean),
  tags: product.tags ?? [],
  variations: product.variations?.values.length ? product.variations : undefined,
  category: product.category ?? "",
  isAvailable: product.isAvailable ?? true,
  inStock: product.inStock ?? 0,
  averageRating: product.averageRating ?? 0,
  ratingCount: product.ratingCount ?? 0,
});

/**
 * Hidden products never reach the store. Older products have no
 * `isAvailable` field at all, so "not false" is asked for instead of "true".
 */
const VISIBLE_ONLY = { isAvailable: { $ne: false } };

const EMPTY_META: PaginationMeta = { page: 1, limit: STORE_PAGE_SIZE, total: 0, totalPage: 0 };

/**
 * The backend turns every unknown query key into a database filter, so only
 * known options are sent.
 */
const toParams = ({ page = 1, limit = STORE_PAGE_SIZE, sort, searchTerm, category }: StoreProductQuery) => ({
  page,
  limit,
  sort: SORT_PARAMS[sort ?? "newest"],
  ...VISIBLE_ONLY,
  ...(searchTerm ? { searchTerm } : {}),
  ...(category ? { category } : {}),
});

async function getProductPage(endpoint: string, params: Record<string, unknown>): Promise<Paginated<Product>> {
  const response = await createApiClient().get<ApiResponse<BackendProduct[] | null>>(endpoint, { params });
  return {
    data: (response.data.data ?? []).map(toProduct),
    meta: response.data.meta ?? EMPTY_META,
  };
}

/** One page of store products, searched, filtered and sorted by the backend. */
export const getProducts = (query: StoreProductQuery = {}) =>
  getProductPage(PRODUCT_ENDPOINTS.products, toParams(query));

/** Products whose flash sale is running right now, ending soonest first. */
export const getFlashSaleProducts = (limit = STORE_PAGE_SIZE) =>
  getProductPage(PRODUCT_ENDPOINTS.flashSale, { page: 1, limit, ...VISIBLE_ONLY });

/**
 * Looks a product up by its slug. Cached per request, so the page and its
 * metadata share one backend call.
 */
export const getProductBySlug = cache(async (slug: string) => {
  const { data } = await getProductPage(PRODUCT_ENDPOINTS.products, { slug, limit: 1 });
  return data[0] ?? null;
});
