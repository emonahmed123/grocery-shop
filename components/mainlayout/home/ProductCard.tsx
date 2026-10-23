import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImage from "@/components/shared/ProductImage";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/assets";
import type { Product } from "@/types/product";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, slug, image, unit, price, currentPrice, maxPrice, isOnFlashSale } = product;
  const hasVariations = maxPrice !== undefined;
  const onSale = currentPrice < price;
  const soldOut = product.inStock <= 0;

  return (
    <article
      title={name}
      className="group relative flex h-full flex-col overflow-hidden rounded-md shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative shrink-0">
        <div className="relative mx-auto h-45 w-full transition duration-200 ease-in-out group-hover:scale-105 sm:w-45 md:size-50">
          <ProductImage
            src={image}
            alt={name}
            sizes="(min-width: 768px) 200px, (min-width: 640px) 180px, 50vw"
            className="object-cover"
          />
        </div>
        <div className="absolute top-2.5 left-3 flex flex-col items-start gap-1 md:top-3.5 md:left-4">
          {soldOut ? (
            <Badge variant="secondary">Out of stock</Badge>
          ) : isOnFlashSale ? (
            <Badge variant="sale">Flash sale</Badge>
          ) : (
            onSale && <Badge variant="sale">On sale</Badge>
          )}
        </div>
        {/* Clicks between the edges fall through to the card link; the button itself stays clickable. */}
        <div className="pointer-events-none absolute inset-x-3 bottom-2 z-10 flex justify-end *:pointer-events-auto md:inset-x-4">
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="flex h-full flex-col px-3 pb-5 md:px-4 lg:px-4.5 lg:pt-1.5 lg:pb-6">
        <div className="-mx-1 mb-1 lg:mb-1.5">
          <span className="mx-1 inline-block text-sm font-semibold text-foreground lg:text-base">
            {hasVariations
              ? `${formatPrice(price)} - ${formatPrice(maxPrice)}`
              : formatPrice(currentPrice)}
          </span>
          {onSale && (
            <del className="mx-1 text-sm text-muted-foreground">
              {formatPrice(price)}
            </del>
          )}
        </div>
        <h3 className="mb-1.5 text-sm leading-5 text-foreground sm:leading-6">
          {/* Stretched link: the whole card opens the product page. */}
          <Link href={`/products/${slug}`} className="after:absolute after:inset-0">
            {name}
          </Link>
        </h3>
        <p className="mt-auto text-sm text-muted-foreground">{unit}</p>
      </div>
    </article>
  );
};

export default ProductCard;
