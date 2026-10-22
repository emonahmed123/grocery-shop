import productListsJson from "@/public/data/product-lists.json";
import productsJson from "@/public/data/products.json";
import type { Product } from "@/types/product";

const products: Product[] = productsJson;

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => product !== undefined);
}

export function getBestSellerProducts() {
  return getProductsBySlugs(productListsJson.bestSeller);
}

export function getPopularProducts() {
  return getProductsBySlugs(productListsJson.popular);
}
