import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Container from "@/components/mainlayout/layout/Container";
import PageBreadcrumb from "@/components/mainlayout/layout/PageBreadcrumb";
import ProductCarousel from "@/components/mainlayout/product/ProductCarousel";
import ProductGallery from "@/components/mainlayout/product/ProductGallery";
import ProductInfo from "@/components/mainlayout/product/ProductInfo";
import ProductTabs from "@/components/mainlayout/product/ProductTabs";
import { getProductBySlug, getProducts } from "@/services/product.services";
import { getProductReviews } from "@/services/review.services";
import type { Product } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return { title: product ? `${product.name} | BoroBazar` : "Product not found" };
}

/** Other products from the same category; loads after the product itself. */
const RelatedProducts = async ({ product }: { product: Product }) => {
  const related = await getProducts({ category: product.category || undefined, limit: 11 })
    .then(({ data }) => data.filter((item) => item.id !== product.id).slice(0, 10))
    .catch(() => []);
  return <ProductCarousel title="Related products" products={related} />;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  // Reviews are extra: if they fail to load, the product still shows.
  const reviews = await getProductReviews(product.id).catch(() => []);

  const hasGallery = product.gallery !== undefined && product.gallery.length > 0;

  return (
    <>
      <Container className="mb-12 pt-28 lg:mb-16 lg:pt-32">
        <PageBreadcrumb
          items={[{ label: "Products", href: "/search" }, { label: product.name }]}
          className="mb-6 lg:mb-8"
        />
        <div className="grid gap-8 lg:grid-cols-10 xl:gap-9">
          <div className="min-w-0 lg:col-span-5 xl:col-span-6">
            <ProductGallery
              name={product.name}
              images={hasGallery ? [product.image, ...(product.gallery ?? [])].filter(Boolean) : [product.image]}
              compact={!hasGallery}
            />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 xl:pl-2">
            <ProductInfo product={product} />
          </div>
        </div>
        <ProductTabs
          productId={product.id}
          description={product.description}
          reviews={reviews}
          averageRating={product.averageRating}
          ratingCount={product.ratingCount}
        />
      </Container>

      <Suspense fallback={null}>
        <RelatedProducts product={product} />
      </Suspense>
      <DownloadApp />
    </>
  );
}
