import CategoryCarousel from "@/components/mainlayout/home/CategoryCarousel";
import CollectionCarousel from "@/components/mainlayout/home/CollectionCarousel";
import DiscountBanner from "@/components/mainlayout/home/DiscountBanner";
import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Banner from "@/components/mainlayout/home/Hero";
import ProductGrid from "@/components/mainlayout/home/ProductGrid";
import PromoCarousel from "@/components/mainlayout/home/PromoCarousel";
import { getBestSellerProducts, getPopularProducts } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Banner />
      <PromoCarousel />
      <CategoryCarousel />
      <ProductGrid
        title="Best seller grocery near you"
        description="We provide best quality & fresh grocery items near your location"
        products={getBestSellerProducts()}
      />
      <DiscountBanner />
      <ProductGrid
        title="Popular product that we sold"
        description="We provide best quality & fresh grocery items near your location"
        products={getPopularProducts()}
      />
      <CollectionCarousel />
      <DownloadApp />
    </>
  );
}
