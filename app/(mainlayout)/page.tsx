import { connection } from "next/server";
import { Suspense } from "react";

import CategoryCarousel from "@/components/mainlayout/home/CategoryCarousel";
import CollectionCarousel from "@/components/mainlayout/home/CollectionCarousel";
import DiscountBanner from "@/components/mainlayout/home/DiscountBanner";
import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Banner from "@/components/mainlayout/home/Hero";
import { ProductGridSkeleton } from "@/components/mainlayout/home/ProductGrid";
import ProductSection from "@/components/mainlayout/home/ProductSection";
import PromoCarousel from "@/components/mainlayout/home/PromoCarousel";
import { getFlashSaleProducts, getProducts } from "@/services/product.services";

export default async function Home() {
  // Rendered per request, so products added in the dashboard show up at once.
  await connection();

  return (
    <>
      <Banner />
      <PromoCarousel />
      <CategoryCarousel />
      <Suspense fallback={null}>
        <ProductSection
          title="Flash sale is live"
          description="Limited-time prices on these items, while stock lasts"
          load={() => getFlashSaleProducts()}
          hideWhenEmpty
        />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductSection
          title="New arrivals near you"
          description="The newest grocery items in our store, freshly added"
          load={() => getProducts({ sort: "newest" })}
          viewAllHref="/search?sort=newest"
        />
      </Suspense>
      <DiscountBanner />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductSection
          title="Popular product that we sold"
          description="We provide best quality & fresh grocery items near your location"
          load={() => getProducts({ sort: "popularity" })}
          viewAllHref="/search?sort=popularity"
        />
      </Suspense>
      <CollectionCarousel />
      <DownloadApp />
    </>
  );
}
