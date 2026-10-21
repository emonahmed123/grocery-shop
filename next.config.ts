import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Storefront demo assets are served from the BoroBazar demo site.
    remotePatterns: [new URL("https://borobazar.vercel.app/assets/**")],
  },
};

export default nextConfig;
