import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Image uploads go through a server action, one image (up to 4 MB) per
      // request; the default 1 MB is too small. Vercel caps bodies at 4.5 MB.
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    // Storefront demo assets are served from the BoroBazar demo site.
    remotePatterns: [
      new URL("https://borobazar.vercel.app/assets/**"),
      new URL("https://borobazar.vercel.app/_next/static/media/**"),
    ],
  },
};

export default nextConfig;
