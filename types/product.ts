export type Product = {
  id: number;
  name: string;
  slug: string;
  image: string;
  unit: string;
  /** Regular price, or the lowest price when `maxPrice` is set. */
  price: number;
  /** Discounted price; marks the product as on sale. */
  salePrice?: number;
  /** Highest price for products sold in several variations. */
  maxPrice?: number;
};
