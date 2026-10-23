"use server";

import axios from "axios";

import { getMeAction } from "@/actions/auth.actions";
import categoriesJson from "@/public/data/categories.json";
import { toImageUrl } from "@/lib/assets";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isAdmin } from "@/lib/roles";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAdminCategories,
  getAdminProduct,
  getAdminProducts,
  getAllOrders,
  getCategories,
  getDashboardStats,
  getFlashSaleHistory,
  getFlashSaleProducts,
  getProductFlashSaleSummary,
  removeFlashSale,
  setFlashSale,
  updateCategory,
  updateOrderStatus,
  updateProduct,
} from "@/services/dashboard.services";
import type { ApiErrorResponse, ApiResult, Paginated } from "@/types/api.types";
import type {
  AdminCategory,
  AdminOrder,
  AdminProduct,
  CategoryOption,
  DashboardStats,
  FlashSaleHistoryQuery,
  FlashSaleRecord,
  FlashSaleState,
  OrderStatus,
  ProductFlashSaleSummary,
  ProductListQuery,
} from "@/types/dashboard.types";
import { categoryZodSchema, type ICategoryFormValues, toCategoryPayload } from "@/zod/category.validation";
import { flashSalePayloadZodSchema, type IFlashSalePayload } from "@/zod/flashSale.validation";
import { type IProductFormValues, productZodSchema, toProductPayload } from "@/zod/product.validation";

const OBJECT_ID = /^[a-f\d]{24}$/i;
const MAX_PAGE_SIZE = 100;

const fail = (message: string): ApiErrorResponse => ({ success: false, message });

/**
 * Server actions are public endpoints, so every write checks for an admin
 * here as well as in the backend.
 */
async function adminOnly(): Promise<ApiErrorResponse | null> {
  try {
    const user = await getMeAction();
    return isAdmin(user) ? null : fail("Only admins can do this");
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not verify your account"));
  }
}

/** Keeps list options within sane bounds before they reach the backend. */
const cleanListQuery = (query: ProductListQuery): ProductListQuery => ({
  page: Math.max(1, Math.floor(query.page) || 1),
  limit: Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(query.limit) || 10)),
  sort: /^-?[A-Za-z.]+$/.test(query.sort ?? "") ? query.sort : undefined,
  searchTerm: query.searchTerm?.trim().slice(0, 100) || undefined,
  category: query.category?.trim() || undefined,
});

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAdminProductsAction(query: ProductListQuery): Promise<ApiResult<Paginated<AdminProduct>>> {
  try {
    const page = await getAdminProducts(cleanListQuery(query));
    return { success: true, message: "Products loaded", data: page };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load products"));
  }
}

export async function getAdminProductAction(id: string): Promise<ApiResult<AdminProduct | null>> {
  if (!OBJECT_ID.test(id)) return { success: true, message: "Not found", data: null };

  try {
    const product = await getAdminProduct(id);
    return { success: true, message: "Product loaded", data: product };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: true, message: "Not found", data: null };
    }
    return fail(getApiErrorMessage(error, "Could not load the product"));
  }
}

export async function createProductAction(values: IProductFormValues): Promise<ApiResult<AdminProduct>> {
  const denied = await adminOnly();
  if (denied) return denied;

  // The browser can be bypassed, so validate again on the server.
  const parsed = productZodSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid product");

  try {
    const product = await createProduct(toProductPayload(parsed.data));
    return { success: true, message: "Product added successfully", data: product };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not add the product"));
  }
}

export async function updateProductAction(
  id: string,
  values: IProductFormValues,
): Promise<ApiResult<AdminProduct>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown product");

  const parsed = productZodSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid product");

  try {
    const product = await updateProduct(id, toProductPayload(parsed.data));
    return { success: true, message: "Product updated successfully", data: product };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not update the product"));
  }
}

export async function deleteProductAction(id: string): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown product");

  try {
    await deleteProduct(id);
    return { success: true, message: "Product deleted", data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not delete the product"));
  }
}

/**
 * Categories from the backend; until any are created there, the store's own
 * category list keeps the form usable.
 */
export async function getCategoriesAction(): Promise<ApiResult<CategoryOption[]>> {
  try {
    const categories = await getCategories();
    if (categories.length > 0) return { success: true, message: "Categories loaded", data: categories };
  } catch {
    // Fall through to the store's list.
  }
  const fallback = categoriesJson.map(({ name, slug }) => ({ name, slug }));
  return { success: true, message: "Store categories", data: fallback };
}

export async function getAdminCategoriesAction(): Promise<ApiResult<AdminCategory[]>> {
  try {
    const categories = await getAdminCategories();
    return { success: true, message: "Categories loaded", data: categories };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load categories"));
  }
}

export async function saveCategoryAction(id: string | undefined, values: ICategoryFormValues): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (id !== undefined && !OBJECT_ID.test(id)) return fail("Unknown category");

  const parsed = categoryZodSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Please check the category");

  try {
    const payload = toCategoryPayload(parsed.data);
    if (id) await updateCategory(id, payload);
    else await createCategory(payload);
    return { success: true, message: id ? "Category updated" : "Category added", data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not save the category"));
  }
}

export async function deleteCategoryAction(id: string): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown category");

  try {
    await deleteCategory(id);
    return { success: true, message: "Category deleted", data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not delete the category"));
  }
}

/**
 * Copies the store's demo categories into the backend, so they can be edited.
 * Ones with a slug that already exists are skipped.
 */
export async function importDemoCategoriesAction(): Promise<ApiResult<{ added: number; failed: number }>> {
  const denied = await adminOnly();
  if (denied) return denied;

  try {
    const existing = new Set((await getAdminCategories()).map((category) => category.slug));
    let added = 0;
    let failed = 0;

    for (const category of categoriesJson) {
      if (existing.has(category.slug)) continue;
      try {
        await createCategory({
          name: category.name,
          slug: category.slug,
          image: { thumbnail: toImageUrl(category.image.thumbnail), original: toImageUrl(category.image.original) },
          icon: toImageUrl(category.icon),
          children: (category.children ?? []).map(({ name, slug }) => ({ name, slug })),
        });
        added += 1;
      } catch {
        // e.g. a deleted category still holds the name; the rest go on.
        failed += 1;
      }
    }

    const message = failed
      ? `${added} categories added, ${failed} could not be added`
      : `${added} categories added`;
    return { success: true, message, data: { added, failed } };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not add the demo categories"));
  }
}

// ─── Flash sale ──────────────────────────────────────────────────────────────

export async function getFlashSaleProductsAction(
  query: ProductListQuery,
): Promise<ApiResult<Paginated<AdminProduct>>> {
  try {
    const page = await getFlashSaleProducts(cleanListQuery(query));
    return { success: true, message: "Flash sale loaded", data: page };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load the flash sale"));
  }
}

export async function setFlashSaleAction(payload: IFlashSalePayload): Promise<ApiResult<number>> {
  const denied = await adminOnly();
  if (denied) return denied;

  const parsed = flashSalePayloadZodSchema.safeParse(payload);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid flash sale");

  try {
    const products = await setFlashSale(parsed.data);
    const count = products.length;
    return { success: true, message: `Flash sale set for ${count} product${count === 1 ? "" : "s"}`, data: count };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not set the flash sale"));
  }
}

export async function removeFlashSaleAction(id: string): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown product");

  try {
    await removeFlashSale(id);
    return { success: true, message: "Removed from the flash sale", data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not remove the flash sale"));
  }
}

const FLASH_SALE_STATES: FlashSaleState[] = ["scheduled", "live", "sold-out", "ended", "removed", "replaced"];

export async function getFlashSaleHistoryAction(
  query: FlashSaleHistoryQuery,
): Promise<ApiResult<Paginated<FlashSaleRecord>>> {
  // Only known values go on: the backend reads them as filters.
  const clean: FlashSaleHistoryQuery = {
    page: Math.max(1, Math.floor(query.page) || 1),
    limit: Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(query.limit) || 10)),
    state: query.state && FLASH_SALE_STATES.includes(query.state) ? query.state : undefined,
    product: query.product && OBJECT_ID.test(query.product) ? query.product : undefined,
  };

  try {
    const page = await getFlashSaleHistory(clean);
    return { success: true, message: "Flash sale history loaded", data: page };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load the flash sale history"));
  }
}

export async function getProductFlashSaleSummaryAction(id: string): Promise<ApiResult<ProductFlashSaleSummary>> {
  if (!OBJECT_ID.test(id)) return fail("Unknown product");

  try {
    const summary = await getProductFlashSaleSummary(id);
    return { success: true, message: "Flash sale summary loaded", data: summary };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load the flash sale summary"));
  }
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getAllOrdersAction(): Promise<ApiResult<AdminOrder[]>> {
  try {
    const orders = await getAllOrders();
    return { success: true, message: "Orders loaded", data: orders };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load orders"));
  }
}

const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: "Order moved back to pending",
  confirmed: "Order confirmed",
  shipped: "Order marked as shipped",
  delivered: "Order marked as delivered",
  cancelled: "Order cancelled",
};

const isOrderStatus = (status: string): status is OrderStatus => Object.hasOwn(ORDER_STATUS_MESSAGES, status);

export async function updateOrderStatusAction(id: string, status: OrderStatus): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown order");
  if (!isOrderStatus(status)) return fail("Unknown status");

  try {
    await updateOrderStatus(id, status);
    return { success: true, message: ORDER_STATUS_MESSAGES[status], data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not update the order"));
  }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getDashboardStatsAction(): Promise<ApiResult<DashboardStats>> {
  try {
    const stats = await getDashboardStats();
    return { success: true, message: "Stats loaded", data: stats };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load the store stats"));
  }
}
