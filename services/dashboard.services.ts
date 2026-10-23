import "server-only";

import { toImageUrl } from "@/lib/assets";
import { httpClient } from "@/lib/axios/httpClient";
import type { Paginated, PaginationMeta } from "@/types/api.types";
import type {
  AdminCategory,
  AdminOrder,
  AdminProduct,
  CategoryOption,
  DashboardStats,
  FlashSale,
  FlashSaleHistoryQuery,
  FlashSaleRecord,
  FlashSaleState,
  OrderStatus,
  ProductFlashSaleSummary,
  ProductListQuery,
  ProductVariation,
} from "@/types/dashboard.types";
import type { ICategoryPayload } from "@/zod/category.validation";
import type { IFlashSalePayload } from "@/zod/flashSale.validation";
import type { IProductPayload } from "@/zod/product.validation";

// Backend contract for the admin dashboard, kept in one place like auth.services.
const DASHBOARD_ENDPOINTS = {
  products: "/product",
  product: (id: string) => `/product/${encodeURIComponent(id)}`,
  flashSale: "/product/flash-sale",
  productFlashSale: (id: string) => `/product/${encodeURIComponent(id)}/flash-sale`,
  categories: "/categories",
  category: (id: string) => `/categories/${encodeURIComponent(id)}`,
  orders: "/bookings",
  orderStatus: (id: string) => `/bookings/${encodeURIComponent(id)}/status`,
  stats: "/stats/admin",
  flashSaleHistory: "/flash-sales/history",
  productFlashSaleSummary: (id: string) => `/flash-sales/products/${encodeURIComponent(id)}/summary`,
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
  userId?: { _id: string; name?: string; email?: string } | string | null;
  /** Current backend: a copy of each product line. */
  items?: {
    product: string;
    name: string;
    image?: string;
    variation?: string;
    price: number;
    quantity: number;
  }[];
  /** Older backend: product ids plus one total quantity. */
  products?: unknown[];
  quantity?: number;
  subTotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: { district: string; address: string; phone: string };
  deliveryInstructions?: { note?: string; leaveAtDoor?: boolean };
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

const toAdminOrder = (order: BackendOrder): AdminOrder => {
  const customer = typeof order.userId === "object" ? order.userId : null;
  return {
    id: order._id,
    // Prefer the account's current name; older orders also kept the checkout name.
    customerName: customer?.name || order.name || "Unknown customer",
    customerEmail: customer?.email,
    productCount: order.items?.length ?? order.products?.length ?? 0,
    quantity: order.items?.reduce((total, item) => total + item.quantity, 0) ?? order.quantity ?? 0,
    items: (order.items ?? []).map((item) => ({
      productId: item.product,
      name: item.name,
      image: item.image,
      variation: item.variation,
      price: item.price,
      quantity: item.quantity,
    })),
    subTotal: order.subTotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.totalAmount,
    status: order.status ?? "pending",
    // Orders from before payment options were all cash on delivery.
    paymentMethod: order.paymentMethod ?? "cash-on-delivery",
    paymentStatus: order.paymentStatus ?? (order.status === "delivered" ? "paid" : "unpaid"),
    shippingAddress: order.shippingAddress,
    deliveryInstructions: order.deliveryInstructions,
    createdAt: order.createdAt,
  };
};

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

type BackendCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: { thumbnail?: string; original?: string };
  icon?: string;
  children?: { name: string; slug: string }[];
  createdAt?: string;
};

const toAdminCategory = (category: BackendCategory): AdminCategory => ({
  id: category._id,
  name: category.name,
  slug: category.slug,
  image: toImageUrl(category.image?.original ?? category.image?.thumbnail),
  icon: toImageUrl(category.icon) || undefined,
  children: category.children ?? [],
  createdAt: category.createdAt,
});

/** The categories saved in the backend, without the store's demo fallback. */
export async function getAdminCategories() {
  const response = await httpClient.get<BackendCategory[] | null>(DASHBOARD_ENDPOINTS.categories, {
    params: { limit: 100, sort: "name" },
  });
  return (response.data ?? []).map(toAdminCategory);
}

export async function createCategory(payload: ICategoryPayload) {
  await httpClient.post(DASHBOARD_ENDPOINTS.categories, payload);
}

/** The backend keeps image fields it is not sent, so both are always sent. */
export async function updateCategory(id: string, payload: ICategoryPayload) {
  await httpClient.patch(DASHBOARD_ENDPOINTS.category(id), payload);
}

export async function deleteCategory(id: string) {
  await httpClient.delete(DASHBOARD_ENDPOINTS.category(id));
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

type BackendFlashSaleRecord = {
  _id: string;
  product: string;
  productName: string;
  productImage?: string;
  regularPrice: number;
  discountPercentage: number;
  startAt: string;
  endAt: string;
  quantityLimit?: number | null;
  soldCount: number;
  state: FlashSaleState;
  closedAt?: string | null;
  revenue: number;
  orderCount: number;
  isLegacy?: boolean;
};

const toFlashSaleRecord = (record: BackendFlashSaleRecord): FlashSaleRecord => ({
  id: record._id,
  productId: record.product,
  productName: record.productName,
  productImage: record.productImage ?? "",
  regularPrice: record.regularPrice,
  discountPercentage: record.discountPercentage,
  startAt: record.startAt,
  endAt: record.endAt,
  quantityLimit: record.quantityLimit ?? undefined,
  soldCount: record.soldCount,
  state: record.state,
  closedAt: record.closedAt ?? undefined,
  revenue: record.revenue,
  orderCount: record.orderCount,
  isLegacy: record.isLegacy ?? false,
});

/** Past and current flash sales, newest first. */
export async function getFlashSaleHistory({ page, limit, state, product }: FlashSaleHistoryQuery) {
  const response = await httpClient.get<BackendFlashSaleRecord[] | null>(DASHBOARD_ENDPOINTS.flashSaleHistory, {
    params: { page, limit, ...(state ? { state } : {}), ...(product ? { product } : {}) },
  });
  return {
    data: (response.data ?? []).map(toFlashSaleRecord),
    meta: response.meta ?? EMPTY_META,
  } satisfies Paginated<FlashSaleRecord>;
}

export async function getProductFlashSaleSummary(id: string) {
  const response = await httpClient.get<ProductFlashSaleSummary>(DASHBOARD_ENDPOINTS.productFlashSaleSummary(id));
  return response.data;
}

/** Moves an order along: pending, confirmed, shipped, delivered; or cancels it (stock goes back). */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  await httpClient.patch(DASHBOARD_ENDPOINTS.orderStatus(id), { status });
}

type BackendStats = Omit<DashboardStats, "lowStock" | "recentOrders"> & {
  lowStock: { _id: string; name: string; image?: string; inStock: number }[];
  recentOrders: BackendOrder[];
};

/** Overview totals; the backend counts them so the browser loads no lists. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await httpClient.get<BackendStats>(DASHBOARD_ENDPOINTS.stats);
  return {
    ...data,
    lowStock: data.lowStock.map(({ _id, name, image, inStock }) => ({ id: _id, name, image: image ?? "", inStock })),
    recentOrders: data.recentOrders.map(toAdminOrder),
  };
}
