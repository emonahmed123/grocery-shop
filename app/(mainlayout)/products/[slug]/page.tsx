import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Container from "@/components/mainlayout/layout/Container";
import PageBreadcrumb from "@/components/mainlayout/layout/PageBreadcrumb";
import ProductCarousel from "@/components/mainlayout/product/ProductCarousel";
import ProductGallery from "@/components/mainlayout/product/ProductGallery";
import ProductInfo from "@/components/mainlayout/product/ProductInfo";
import ProductTabs from "@/components/mainlayout/product/ProductTabs";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const POPCORN_PATTERN = /pop|kettle corn|corn kernels/i;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.name ?? "Product not found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const otherProducts = getAllProducts().filter((item) => item.slug !== slug);
  const relatedProducts = otherProducts.slice(0, 10);
  const popcornProducts = otherProducts.filter((item) =>
    POPCORN_PATTERN.test(item.name),
  );
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
              images={hasGallery ? (product.gallery ?? []) : [product.image]}
              compact={!hasGallery}
            />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 xl:pl-2">
            <ProductInfo product={product} />
          </div>
        </div>
        <ProductTabs description={product.description} />
      </Container>

      <ProductCarousel title="Related products" products={relatedProducts} />
      <ProductCarousel title="Popcorn & Jerky" products={popcornProducts} />
      <DownloadApp />
    </>
  );
}
