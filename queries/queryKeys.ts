import type { FlashSaleHistoryQuery, ProductListQuery } from "@/types/dashboard.types";

// Every dashboard key in one place. Flash sale keys sit under the products
// prefix, so invalidating `products` refreshes lists, details and flash sales.
export const dashboardKeys = {
  all: ["dashboard"] as const,
  products: ["dashboard", "products"] as const,
  productList: (query: ProductListQuery) => ["dashboard", "products", "list", query] as const,
  product: (id: string) => ["dashboard", "products", "detail", id] as const,
  flashSale: (query: ProductListQuery) => ["dashboard", "products", "flash-sale", query] as const,
  flashSaleHistory: (query: FlashSaleHistoryQuery) =>
    ["dashboard", "products", "flash-sale-history", query] as const,
  flashSaleSummary: (id: string) => ["dashboard", "products", "flash-sale-summary", id] as const,
  // Under `categories`, so saving one refreshes the dropdowns as well.
  categories: ["dashboard", "categories"] as const,
  adminCategories: ["dashboard", "categories", "admin"] as const,
  orders: ["dashboard", "orders"] as const,
  stats: ["dashboard", "stats"] as const,
};
