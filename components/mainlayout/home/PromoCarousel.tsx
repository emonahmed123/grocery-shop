import Container from "@/components/mainlayout/layout/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import bundlesJson from "@/public/data/bundles.json";
import type { Bundle } from "@/types/promotion";
import Image from "next/image";
import Link from "next/link";

const toneClasses: Record<string, string> = {
  peach: "bg-promo-peach",
  green: "bg-promo-green",
  blue: "bg-promo-blue",
  rose: "bg-promo-rose",
};

const PromoCarousel = () => {
  const bundles: Bundle[] = bundlesJson;

  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {bundles.map((bundle) => (
            <CarouselItem
              key={bundle.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Link href="/search" className="group flex">
                <div
                  className={cn(
                    "relative flex w-full items-center overflow-hidden",
                    toneClasses[bundle.tone] ?? "bg-fill-thumbnail",
                  )}
                >
                  <div className="flex w-36 shrink-0 pr-1.5 lg:w-32 xl:w-40">
                    <Image
                      src={assetUrl(bundle.image)}
                      alt={bundle.title}
                      width={180}
                      height={150}
                      className="mx-auto h-auto w-full object-cover transition duration-200 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="py-3 pr-4 lg:py-5 lg:pr-3 xl:pr-4">
                    <h3 className="mb-1 font-manrope text-base font-semibold text-foreground xl:text-lg">
                      {bundle.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {bundle.description}
                    </p>
                  </div>
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

export default PromoCarousel;
