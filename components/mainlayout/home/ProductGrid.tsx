import ProductCard from "@/components/mainlayout/home/ProductCard";
import SectionHeader from "@/components/mainlayout/home/SectionHeader";
import Container from "@/components/mainlayout/layout/Container";
import type { Product } from "@/types/product";

type ProductGridProps = {
  title: string;
  description: string;
  products: Product[];
};

const ProductGrid = ({ title, description, products }: ProductGridProps) => {
  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <SectionHeader title={title} description={description} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
};

export default ProductGrid;
