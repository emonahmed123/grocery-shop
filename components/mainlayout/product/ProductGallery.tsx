"use client";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductImage from "@/components/shared/ProductImage";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
  /** Small catalog thumbnails need padding so they are not upscaled. */
  compact?: boolean;
};

const ProductGallery = ({ name, images, compact = false }: ProductGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-5">
      {images.length > 1 && (
        <div className="flex gap-3 lg:w-37.5 lg:shrink-0 lg:flex-col">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={selected === index}
              className={cn(
                "relative h-20 w-24 overflow-hidden rounded-md border transition-colors hover:border-foreground/40 lg:h-34 lg:w-full",
                selected === index && "border-foreground/40",
              )}
            >
              <ProductImage
                src={image}
                alt=""
                sizes="150px"
                className="object-contain p-2 lg:p-4"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative min-w-0 flex-1 overflow-hidden rounded-md border">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image}>
                <div className="relative h-80 sm:h-100 lg:h-120 xl:h-146">
                  <ProductImage
                    src={image}
                    alt={`${name} - image ${index + 1}`}
                    priority={index === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={cn(
                      "object-contain",
                      compact && "p-16 sm:p-24 lg:p-32",
                    )}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious size="icon-lg" className="left-4 disabled:hidden" />
              <CarouselNext size="icon-lg" className="right-4 disabled:hidden" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductGallery;
