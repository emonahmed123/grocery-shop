import ProductCard from "@/components/mainlayout/home/ProductCard";
import Container from "@/components/mainlayout/layout/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types/product";

type ProductCarouselProps = {
  title: string;
  products: Product[];
};

const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  if (products.length === 0) return null;

  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <h2 className="mb-4 font-manrope text-lg font-bold text-foreground lg:mb-5 lg:text-xl xl:text-2xl">
        {title}
      </h2>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              {/* Vertical room keeps the card shadow from being clipped. */}
              <div className="h-full py-2">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="icon-lg" className="-left-3.5 disabled:hidden xl:-left-5" />
        <CarouselNext size="icon-lg" className="-right-3.5 disabled:hidden xl:-right-5" />
      </Carousel>
    </Container>
  );
};

export default ProductCarousel;
