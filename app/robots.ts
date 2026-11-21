import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pages that need a signed-in user or only make sense mid-purchase.
      disallow: [
        "/dashboard",
        "/my-account",
        "/checkout",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/api/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
