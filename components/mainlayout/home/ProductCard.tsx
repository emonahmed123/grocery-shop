import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assetUrl, formatPrice } from "@/lib/assets";
import type { Product } from "@/types/product";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, image, unit, price, salePrice, maxPrice } = product;
  const hasVariations = maxPrice !== undefined;
  const onSale = salePrice !== undefined;

  return (
    <article
      title={name}
      className="group relative flex h-full flex-col overflow-hidden rounded-md shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative shrink-0">
        <div className="relative mx-auto h-45 w-full transition duration-200 ease-in-out group-hover:scale-105 sm:w-45 md:size-50">
          <Image
            src={assetUrl(image)}
            alt={name}
            fill
            sizes="(min-width: 768px) 200px, (min-width: 640px) 180px, 50vw"
            className="object-cover"
          />
        </div>
        {onSale && (
          <Badge variant="sale" className="absolute top-2.5 left-3 md:top-3.5 md:left-4">
            On sale
          </Badge>
        )}
        {/* Variable products open the product page; simple ones go straight to the cart. */}
        <Button
          variant="brand"
          size="icon-lg"
          className="absolute right-3 bottom-2 md:right-4"
          aria-label={hasVariations ? `View ${name}` : `Add ${name} to cart`}
        >
          {hasVariations ? <Eye /> : <Plus />}
        </Button>
      </div>

      <div className="flex h-full flex-col px-3 pb-5 md:px-4 lg:px-4.5 lg:pt-1.5 lg:pb-6">
        <div className="-mx-1 mb-1 lg:mb-1.5">
          <span className="mx-1 inline-block text-sm font-semibold text-foreground lg:text-base">
            {hasVariations
              ? `${formatPrice(price)} - ${formatPrice(maxPrice)}`
              : formatPrice(salePrice ?? price)}
          </span>
          {onSale && (
            <del className="mx-1 text-sm text-muted-foreground">
              {formatPrice(price)}
            </del>
          )}
        </div>
        <h3 className="mb-1.5 text-sm leading-5 text-foreground sm:leading-6">
          {name}
        </h3>
        <p className="mt-auto text-sm text-muted-foreground">{unit}</p>
      </div>
    </article>
  );
};

export default ProductCard;
