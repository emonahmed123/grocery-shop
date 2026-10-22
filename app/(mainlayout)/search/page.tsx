import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import ProductCard from "@/components/mainlayout/home/ProductCard";
import Container from "@/components/mainlayout/layout/Container";
import SearchSidebar from "@/components/mainlayout/search/SearchSidebar";
import SearchToolbar from "@/components/mainlayout/search/SearchToolbar";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/products";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { category } = await searchParams;
  const activeCategory = Array.isArray(category) ? category[0] : category;
  // Filtering and sorting come later; every product is listed for now.
  const products = getAllProducts();

  return (
    <>
      <Container className="flex pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="hidden w-80 shrink-0 pr-8 lg:block xl:w-96 xl:pr-16">
          <SearchSidebar activeCategory={activeCategory} />
        </div>

        <div className="min-w-0 flex-1">
          <SearchToolbar total={products.length} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center lg:mt-12">
            <Button variant="brand" size="lg">
              Load More
            </Button>
          </div>
        </div>
      </Container>
      <DownloadApp />
    </>
  );
}
