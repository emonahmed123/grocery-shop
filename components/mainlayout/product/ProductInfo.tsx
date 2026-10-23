import ProductPurchase from "@/components/mainlayout/product/ProductPurchase";
import Stars from "@/components/mainlayout/product/Stars";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/assets";
import type { Product } from "@/types/product";
import { Tag } from "lucide-react";
import Link from "next/link";

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { name, price, currentPrice, maxPrice, tags, flashSale, isOnFlashSale } = product;
  const hasVariations = maxPrice !== undefined;
  const onSale = currentPrice < price;
  const soldOut = product.inStock <= 0 || !product.isAvailable;

  return (
    <div className="flex flex-col">
      <div className="pb-3 lg:pb-5">
        <h1 className="text-lg font-medium text-foreground md:text-xl xl:text-2xl">
          {name}
        </h1>
        {product.ratingCount > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Stars rating={product.averageRating} />
            {product.averageRating.toFixed(1)} ({product.ratingCount})
          </div>
        )}
        <div className="mt-5 flex items-center gap-2">
          <span className="text-base font-bold text-foreground md:text-xl xl:text-2xl">
            {hasVariations
              ? `${formatPrice(price)} - ${formatPrice(maxPrice)}`
              : formatPrice(currentPrice)}
          </span>
          {onSale && (
            <del className="text-sm text-muted-foreground md:text-base">
              {formatPrice(price)}
            </del>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {isOnFlashSale && flashSale && (
            <Badge variant="sale">Flash sale · {flashSale.discountPercentage}% off</Badge>
          )}
          {soldOut ? (
            <Badge variant="destructive">{product.isAvailable ? "Out of stock" : "Not available"}</Badge>
          ) : (
            <Badge variant="success">In stock: {product.inStock}</Badge>
          )}
          {product.unit && <span className="text-muted-foreground">{product.unit}</span>}
        </div>
      </div>

      <div className="pt-1.5 lg:pt-3">
        <ProductPurchase product={product} />
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 text-sm text-foreground">
            <Tag className="size-4 text-muted-foreground" />
            Tags:
          </span>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?searchTerm=${encodeURIComponent(tag)}`}
              className="rounded-sm border px-2 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
