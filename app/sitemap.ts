import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/siteConfig";
import { getProducts } from "@/services/product.services";
import type { Product } from "@/types/product";

// Rebuilt at most once an hour, so new products show up without a redeploy.
export const revalidate = 3600;

/** Products asked for per backend call while listing them all. */
const PAGE_SIZE = 100;

// Public store pages only; sign-in, account, checkout and dashboard pages stay out.
const STATIC_PAGES: { path: string; changeFrequency: "daily" | "weekly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/search", changeFrequency: "daily", priority: 0.8 },
  { path: "/about-us", changeFrequency: "yearly", priority: 0.5 },
  { path: "/contact-us", changeFrequency: "yearly", priority: 0.5 },
  { path: "/faq", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Next.js writes sitemap values into the XML as they are, so characters such
 * as the `&` in an image URL's query string must be escaped here.
 */
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Every product the store shows, fetched page by page. */
async function getAllProducts(): Promise<Product[]> {
  const first = await getProducts({ page: 1, limit: PAGE_SIZE });
  const rest = await Promise.all(
    Array.from({ length: Math.max(first.meta.totalPage - 1, 0) }, (_, index) =>
      getProducts({ page: index + 2, limit: PAGE_SIZE }).then(({ data }) => data),
    ),
  );
  return [...first.data, ...rest.flat()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: escapeXml(`${siteUrl}${path}`),
    changeFrequency,
    priority,
  }));

  // If the backend is down, still serve the store pages rather than an error.
  const products = await getAllProducts().catch(() => []);

  return [
    ...pages,
    ...products.map((product) => ({
      url: escapeXml(`${siteUrl}/products/${encodeURIComponent(product.slug)}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: product.image ? [escapeXml(product.image)] : undefined,
    })),
  ];
}
