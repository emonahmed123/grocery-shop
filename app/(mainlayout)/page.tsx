import CategoryCarousel from "@/components/mainlayout/home/CategoryCarousel";
import CollectionCarousel from "@/components/mainlayout/home/CollectionCarousel";
import DiscountBanner from "@/components/mainlayout/home/DiscountBanner";
import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Banner from "@/components/mainlayout/home/Hero";
import ProductGrid from "@/components/mainlayout/home/ProductGrid";
import PromoCarousel from "@/components/mainlayout/home/PromoCarousel";
import bestSellerJson from "@/public/data/best-seller-products.json";
import popularJson from "@/public/data/popular-products.json";
import type { Product } from "@/types/product";

const bestSellerProducts: Product[] = bestSellerJson;
const popularProducts: Product[] = popularJson;

export default function Home() {
  return (
    <>
      <Banner />
      <PromoCarousel />
      <CategoryCarousel />
      <ProductGrid
        title="Best seller grocery near you"
        description="We provide best quality & fresh grocery items near your location"
        products={bestSellerProducts}
      />
      <DiscountBanner />
      <ProductGrid
        title="Popular product that we sold"
        description="We provide best quality & fresh grocery items near your location"
        products={popularProducts}
      />
      <CollectionCarousel />
      <DownloadApp />
    </>
  );
}
