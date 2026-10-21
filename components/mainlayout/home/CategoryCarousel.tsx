import SectionHeader from "@/components/mainlayout/home/SectionHeader";
import Container from "@/components/mainlayout/layout/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { assetUrl } from "@/lib/assets";
import categoriesJson from "@/public/data/categories.json";
import type { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";

const CategoryCarousel = () => {
  const categories: Category[] = categoriesJson;

  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <SectionHeader
        title="What food you love to order"
        description="Here order your favorite foods from different categories"
      />

      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7"
            >
              <Link href="/product" className="group block w-full text-center">
                {/* Two copies of the image slide across on hover. */}
                <div className="mx-auto mb-3.5 flex aspect-square w-full max-w-44.5 items-center overflow-hidden rounded-full bg-fill-thumbnail xl:mb-4">
                  <div className="flex size-full shrink-0 -translate-x-full scale-50 transform-gpu items-center justify-center transition-all duration-700 group-hover:translate-x-0 group-hover:scale-100">
                    <Image
                      src={assetUrl(category.image.thumbnail)}
                      alt=""
                      width={178}
                      height={178}
                      className="aspect-square size-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex size-full shrink-0 -translate-x-full scale-100 transform-gpu items-center justify-center transition-all duration-700 group-hover:translate-x-0 group-hover:scale-50">
                    <Image
                      src={assetUrl(category.image.thumbnail)}
                      alt={category.name}
                      width={178}
                      height={178}
                      className="aspect-square size-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="truncate text-sm text-foreground capitalize lg:text-base">
                  {category.name}
                </h3>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="icon-lg" className="-left-3.5 disabled:hidden xl:-left-5" />
        <CarouselNext size="icon-lg" className="-right-3.5 disabled:hidden xl:-right-5" />
      </Carousel>
    </Container>
  );
};

export default CategoryCarousel;
