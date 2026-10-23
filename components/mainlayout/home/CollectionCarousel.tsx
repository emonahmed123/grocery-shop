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
import collectionsJson from "@/public/data/collections.json";
import type { Collection } from "@/types/promotion";
import Image from "next/image";
import Link from "next/link";

const CollectionCarousel = () => {
  const collections: Collection[] = collectionsJson;

  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <SectionHeader
        title="Curated collections"
        description="We have categories the best quality grocery items"
      />

      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {collections.map((collection) => (
            <CarouselItem
              key={collection.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Link
                href="/search"
                className="group my-4 flex flex-col overflow-hidden rounded-md shadow-sm"
              >
                <div className="overflow-hidden">
                  <Image
                    src={assetUrl(collection.image)}
                    alt={collection.title}
                    width={440}
                    height={280}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-90"
                  />
                </div>
                <div className="flex flex-col p-4 lg:px-5 lg:pt-5 lg:pb-6 xl:px-6 xl:pb-7">
                  <h3 className="mb-1 truncate font-manrope text-base font-semibold text-foreground transition-colors group-hover:text-brand lg:mb-1.5 xl:text-lg">
                    {collection.title}
                  </h3>
                  <p className="truncate text-sm leading-7 text-muted-foreground xl:text-base">
                    {collection.description}
                  </p>
                </div>
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

export default CollectionCarousel;
