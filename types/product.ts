/** A flash sale on one product; the backend works out the sale price. */
export type ProductFlashSale = {
  discountPercentage: number;
  startAt: string;
  endAt: string;
  quantityLimit?: number;
  soldCount: number;
};

/** A product as the store shows it, mapped from the backend. */
export type Product = {
  id: string;
  name: string;
  slug: string;
  /** Full image URL. */
  image: string;
  unit: string;
  /** Regular price, or the lowest price when `maxPrice` is set. */
  price: number;
  /** Discounted price; marks the product as on sale. */
  salePrice?: number;
  /** Highest price for products sold in several variations. */
  maxPrice?: number;
  /** What a customer pays right now: the flash, sale or regular price. */
  currentPrice: number;
  isOnFlashSale: boolean;
  flashSale?: ProductFlashSale;
  description?: string;
  /** Extra images shown on the product page. */
  gallery?: string[];
  tags?: string[];
  variations?: {
    name: string;
    values: string[];
  };
  /** Category slug. */
  category: string;
  isAvailable: boolean;
  inStock: number;
  averageRating: number;
  ratingCount: number;
};

export type StoreSort = "newest" | "lowest-price" | "highest-price" | "popularity";

/** What the store asks the backend for; everything else is left out. */
export type StoreProductQuery = {
  page?: number;
  limit?: number;
  sort?: StoreSort;
  searchTerm?: string;
  category?: string;
};
