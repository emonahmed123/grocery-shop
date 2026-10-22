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

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

/** An order from any customer, as the admin sees it. */
export interface AdminOrder {
  id: string;
  customerName: string;
  productCount: number;
  quantity: number;
  totalAmount: number;
  /** One of `OrderStatus`; unknown backend values are shown as-is. */
  status: string;
  createdAt?: string;
}
