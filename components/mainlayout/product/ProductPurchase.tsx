"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCartActions } from "@/store/cart.store";
import type { Product } from "@/types/product";
import { Heart, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProductPurchaseProps = {
  product: Product;
};

// Quantity and variation are local until "Add to Cart"; wishlist and share come later.
const ProductPurchase = ({ product }: ProductPurchaseProps) => {
  const { variations } = product;
  const [variation, setVariation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartActions();
  const needsVariation = variations !== undefined && variation === "";
  const soldOut = product.inStock <= 0 || !product.isAvailable;

  const handleAddToCart = () => {
    addItem(product, { quantity, variation: variation || undefined });
    toast.success(`${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <div className="flex flex-col gap-2.5 md:gap-3.5">
      {variations && (
        <div className="mb-2 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{variations.name}:</p>
          <ToggleGroup
            type="single"
            variant="brand"
            size="lg"
            spacing={2}
            value={variation}
            onValueChange={setVariation}
            aria-label={variations.name}
            className="flex-wrap"
          >
            {variations.values.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      <div className="flex h-11 items-center justify-center rounded-md bg-fill-thumbnail p-1 md:h-14">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((count) => Math.max(1, count - 1))}
        >
          <Minus />
        </Button>
        <span className="w-12 text-center text-base font-semibold text-foreground md:w-20 xl:w-28">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Increase quantity"
          disabled={quantity >= product.inStock}
          onClick={() => setQuantity((count) => Math.min(product.inStock, count + 1))}
        >
          <Plus />
        </Button>
      </div>

      <Button
        variant="brand"
        size="lg"
        className="h-11 w-full md:h-14"
        disabled={needsVariation || soldOut}
        onClick={handleAddToCart}
      >
        <ShoppingBag />
        {soldOut ? "Out of Stock" : "Add to Cart"}
      </Button>

      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" size="lg" className="h-11 w-full md:h-14">
          <Heart />
          Wishlist
        </Button>
        <Button variant="outline" size="lg" className="h-11 w-full md:h-14">
          <Share2 />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ProductPurchase;
