"use client";

import { Eye, Plus } from "lucide-react";
import Link from "next/link";

import QuantityCounter from "@/components/cart/QuantityCounter";
import { Button } from "@/components/ui/button";
import { getCartItemKey, useCartActions, useCartItemQuantity } from "@/store/cart.store";
import type { Product } from "@/types/product";

/** Product card action: "+" adds to cart, then turns into a quantity counter. */
const AddToCartButton = ({ product }: { product: Product }) => {
  const key = getCartItemKey(product.id);
  const quantity = useCartItemQuantity(key);
  const { addItem, increaseItem, decreaseItem } = useCartActions();

  // Variable products need a choice first, so they open the product page.
  if (product.maxPrice !== undefined) {
    return (
      <Button asChild variant="brand" size="icon-circle">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name} options`}>
          <Eye />
        </Link>
      </Button>
    );
  }

  if (quantity > 0) {
    return (
      <QuantityCounter
        quantity={quantity}
        label={product.name}
        onDecrease={() => decreaseItem(key)}
        onIncrease={() => increaseItem(key)}
      />
    );
  }

  return (
    <Button
      variant="brand"
      size="icon-circle"
      aria-label={`Add ${product.name} to cart`}
      onClick={() => addItem(product)}
    >
      <Plus />
    </Button>
  );
};

export default AddToCartButton;
