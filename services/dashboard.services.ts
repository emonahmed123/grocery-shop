import "server-only";

import { httpClient } from "@/lib/axios/httpClient";
import type { Paginated, PaginationMeta } from "@/types/api.types";
import type {
  AdminOrder,
  AdminProduct,
  CategoryOption,
  FlashSale,
  ProductListQuery,
  ProductVariation,
} from "@/types/dashboard.types";
import type { IFlashSalePayload } from "@/zod/flashSale.validation";
import type { IProductPayload } from "@/zod/product.validation";

// Backend contract for the admin dashboard, kept in one place like auth.services.
const DASHBOARD_ENDPOINTS = {
  products: "/product",
  product: (id: string) => `/product/${encodeURIComponent(id)}`,
  flashSale: "/product/flash-sale",
  productFlashSale: (id: string) => `/product/${encodeURIComponent(id)}/flash-sale`,
  categories: "/categories",
  orders: "/bookings",
  // The backend's PUT on a booking marks it as delivered.
  deliverOrder: (id: string) => `/bookings/${encodeURIComponent(id)}`,
};

type BackendProduct = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  unit?: string;
  price: number;
  salePrice?: number;
  maxPrice?: number;
  currentPrice?: number;
  isOnFlashSale?: boolean;
  description?: string;
  gallery?: string[];
  tags?: string[];
  variations?: ProductVariation;
  category?: string;
  isAvailable?: boolean;
  inStock?: number;
  averageRating?: number;
  ratingCount?: number;
  flashSale?: FlashSale;
  createdAt?: string;
  updatedAt?: string;
};

type BackendOrder = {
  _id: string;
  name?: string;
  userId?: { _id: string; name?: string } | string | null;
  /** Current backend: one line per product. */
  items?: { quantity: number }[];
  /** Older backend: product ids plus one total quantity. */
  products?: unknown[];
  quantity?: number;
  totalAmount: number;
  status?: string;
  createdAt?: string;
};

const toAdminProduct = (product: BackendProduct): AdminProduct => ({
  id: product._id,
  name: product.name,
  slug: product.slug ?? "",
  image: product.image ?? "",
  unit: product.unit ?? "",
  price: product.price,
  salePrice: product.salePrice,
  maxPrice: product.maxPrice,
  currentPrice: product.currentPrice ?? product.salePrice ?? product.price,
  isOnFlashSale: product.isOnFlashSale ?? false,
  description: product.description ?? "",
  gallery: product.gallery ?? [],
  tags: product.tags ?? [],
  variations: product.variations,
  category: product.category ?? "",
  isAvailable: product.isAvailable ?? true,
  inStock: product.inStock ?? null,
  averageRating: product.averageRating ?? 0,
  ratingCount: product.ratingCount ?? 0,
  flashSale: product.flashSale,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const toAdminOrder = (order: BackendOrder): AdminOrder => ({
  id: order._id,
  // Prefer the account's current name; older orders also kept the checkout name.
  customerName:
    (typeof order.userId === "object" && order.userId?.name) || order.name || "Unknown customer",
  productCount: order.items?.length ?? order.products?.length ?? 0,
  quantity: order.items?.reduce((total, item) => total + item.quantity, 0) ?? order.quantity ?? 0,
  totalAmount: order.totalAmount,
  status: order.status ?? "pending",
  createdAt: order.createdAt,
});

const EMPTY_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPage: 0 };

/**
 * Only known list options reach the backend: it turns any other query key
 * into a database filter, so nothing else is forwarded.
 */
const toListParams = ({ page, limit, sort, searchTerm, category }: ProductListQuery) => ({
  page,
  limit,
  ...(sort ? { sort } : {}),
  ...(searchTerm ? { searchTerm } : {}),
  ...(category ? { category } : {}),
});

async function getProductPage(endpoint: string, query: ProductListQuery): Promise<Paginated<AdminProduct>> {
  const response = await httpClient.get<BackendProduct[] | null>(endpoint, { params: toListParams(query) });
  return {
    data: (response.data ?? []).map(toAdminProduct),
    meta: response.meta ?? EMPTY_META,
  };
}

/** One page of products, searched, filtered and sorted by the backend. */
export const getAdminProducts = (query: ProductListQuery) =>
  getProductPage(DASHBOARD_ENDPOINTS.products, query);

/** Products whose flash sale is running right now. */
export const getFlashSaleProducts = (query: ProductListQuery) =>
  getProductPage(DASHBOARD_ENDPOINTS.flashSale, query);

/** `null` when the product does not exist. */
export async function getAdminProduct(id: string) {
  const response = await httpClient.get<BackendProduct | null>(DASHBOARD_ENDPOINTS.product(id));
  return response.data ? toAdminProduct(response.data) : null;
}

export async function createProduct(payload: IProductPayload) {
  const response = await httpClient.post<BackendProduct>(DASHBOARD_ENDPOINTS.products, payload);
  return toAdminProduct(response.data);
}

export async function updateProduct(id: string, payload: IProductPayload) {
  const response = await httpClient.put<BackendProduct>(DASHBOARD_ENDPOINTS.product(id), payload);
  return toAdminProduct(response.data);
}

/** The backend soft-deletes, so the product only disappears from listings. */
export async function deleteProduct(id: string) {
  await httpClient.delete(DASHBOARD_ENDPOINTS.product(id));
}

/** Puts the products on a flash sale; replaces any sale they already had. */
export async function setFlashSale(payload: IFlashSalePayload) {
  const response = await httpClient.post<BackendProduct[]>(DASHBOARD_ENDPOINTS.flashSale, payload);
  return (response.data ?? []).map(toAdminProduct);
}

export async function removeFlashSale(id: string) {
  await httpClient.delete(DASHBOARD_ENDPOINTS.productFlashSale(id));
}

export async function getCategories(): Promise<CategoryOption[]> {
  const response = await httpClient.get<{ name: string; slug: string }[] | null>(DASHBOARD_ENDPOINTS.categories, {
    params: { limit: 100, sort: "name" },
  });
  return (response.data ?? []).map(({ name, slug }) => ({ name, slug }));
}

const byNewest = <T extends { createdAt?: string }>(a: T, b: T) =>
  (b.createdAt ?? "").localeCompare(a.createdAt ?? "");

/**
 * Every order, newest first. The orders table still pages in the browser, so
 * it asks for a large page; it moves to backend paging like products later.
 */
export async function getAllOrders() {
  const response = await httpClient.get<BackendOrder[] | null>(DASHBOARD_ENDPOINTS.orders, {
    params: { limit: 1000, sort: "-createdAt" },
  });
  return (response.data ?? []).map(toAdminOrder).sort(byNewest);
}

export async function markOrderDelivered(id: string) {
  await httpClient.put(DASHBOARD_ENDPOINTS.deliverOrder(id));
}
