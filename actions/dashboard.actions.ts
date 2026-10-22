"use server";

import axios from "axios";

import { getMeAction } from "@/actions/auth.actions";
import categoriesJson from "@/public/data/categories.json";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isAdmin } from "@/lib/roles";
import {
  createProduct,
  deleteProduct,
  getAdminProduct,
  getAdminProducts,
  getAllOrders,
  getCategories,
  getFlashSaleProducts,
  markOrderDelivered,
  removeFlashSale,
  setFlashSale,
  updateProduct,
} from "@/services/dashboard.services";
import type { ApiErrorResponse, ApiResult, Paginated } from "@/types/api.types";
import type { AdminOrder, AdminProduct, CategoryOption, ProductListQuery } from "@/types/dashboard.types";
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

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getAllOrdersAction(): Promise<ApiResult<AdminOrder[]>> {
  try {
    const orders = await getAllOrders();
    return { success: true, message: "Orders loaded", data: orders };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not load orders"));
  }
}

export async function markOrderDeliveredAction(id: string): Promise<ApiResult<null>> {
  const denied = await adminOnly();
  if (denied) return denied;
  if (!OBJECT_ID.test(id)) return fail("Unknown order");

  try {
    await markOrderDelivered(id);
    return { success: true, message: "Order marked as delivered", data: null };
  } catch (error) {
    return fail(getApiErrorMessage(error, "Could not update the order"));
  }
}
