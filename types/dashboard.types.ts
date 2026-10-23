export interface FlashSale {
  /** Percent taken off the regular price. */
  discountPercentage: number;
  startAt: string;
  endAt: string;
  /** Units that can sell at the flash price; no limit when missing. */
  quantityLimit?: number;
  soldCount: number;
}

export interface ProductVariation {
  /** e.g. "Weight" */
  name: string;
  /** e.g. ["500 g", "1 kg"] */
  values: string[];
}

/** A product as the admin dashboard manages it. */
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  unit: string;
  /** Regular price, or the lowest price when `maxPrice` is set. */
  price: number;
  salePrice?: number;
  /** Highest price for products sold in several variations. */
  maxPrice?: number;
  /** What a customer pays right now (flash price, sale price or price). */
  currentPrice: number;
  isOnFlashSale: boolean;
  description: string;
  gallery: string[];
  tags: string[];
  variations?: ProductVariation;
  /** Category slug. */
  category: string;
  isAvailable: boolean;
  /** `null` for older products the backend never tracked stock for. */
  inStock: number | null;
  averageRating: number;
  ratingCount: number;
  flashSale?: FlashSale;
  createdAt?: string;
  updatedAt?: string;
}

/** A category as the dashboard edits it. */
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  /** Full image URL. */
  image: string;
  icon?: string;
  children: { name: string; slug: string }[];
  createdAt?: string;
}

export interface CategoryOption {
  name: string;
  slug: string;
}

/** The list options the dashboard sends to the product endpoints. */
export interface ProductListQuery {
  page: number;
  limit: number;
  /** Backend sort field, `-` prefix for descending, e.g. "-createdAt". */
  sort?: string;
  searchTerm?: string;
  category?: string;
}

/** Where a flash sale stands; removed and replaced mean the admin stopped it early. */
export type FlashSaleState = "scheduled" | "live" | "sold-out" | "ended" | "removed" | "replaced";

/** One flash sale on one product, kept after it is over. */
export interface FlashSaleRecord {
  id: string;
  productId: string;
  /** Name and price from when the sale started. */
  productName: string;
  productImage: string;
  regularPrice: number;
  discountPercentage: number;
  startAt: string;
  endAt: string;
  quantityLimit?: number;
  soldCount: number;
  state: FlashSaleState;
  /** When the admin removed or replaced it. */
  closedAt?: string;
  /** From linked orders; cancelled orders are left out. */
  revenue: number;
  orderCount: number;
  /** Started before history was kept, so its earlier orders are not linked. */
  isLegacy: boolean;
}

export interface FlashSaleHistoryQuery {
  page: number;
  limit: number;
  state?: FlashSaleState;
  /** Product id. */
  product?: string;
}

/** Everything one product sold at flash prices, older orders included. */
export interface ProductFlashSaleSummary {
  saleCount: number;
  unitsSold: number;
  revenue: number;
  orderCount: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

/** One line of an order, priced when it was placed. */
export interface AdminOrderItem {
  productId: string;
  name: string;
  image?: string;
  variation?: string;
  price?: number;
  quantity?: number;
}

/** An order from any customer, as the admin sees it. */
export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail?: string;
  productCount: number;
  quantity: number;
  items: AdminOrderItem[];
  subTotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  /** One of `OrderStatus`; unknown backend values are shown as-is. */
  status: string;
  /** "cash-on-delivery" or "card". */
  paymentMethod: string;
  /** unpaid, paid, failed or refunded. */
  paymentStatus: string;
  shippingAddress?: { district: string; address: string; phone: string };
  deliveryInstructions?: { note?: string; leaveAtDoor?: boolean };
  createdAt?: string;
}

/** A product that is running out, as the overview lists it. */
export interface LowStockProduct {
  id: string;
  name: string;
  image: string;
  inStock: number;
}

/** Store totals for the dashboard overview, counted by the backend. */
export interface DashboardStats {
  /** Sum of delivered orders. */
  revenue: number;
  totalOrders: number;
  deliveredOrders: number;
  /** Orders not yet delivered or cancelled. */
  pendingOrders: number;
  cancelledOrders: number;
  customerCount: number;
  totalProducts: number;
  categoryCount: number;
  /** Category slugs with their product counts, largest first. */
  topCategories: { category: string; count: number }[];
  /** Products below this stock count are listed in `lowStock`. */
  lowStockLimit: number;
  lowStock: LowStockProduct[];
  recentOrders: AdminOrder[];
}
