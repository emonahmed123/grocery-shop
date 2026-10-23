"use client";

import { ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CartItemRow from "@/components/cart/CartItemRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { assetUrl, formatPrice } from "@/lib/assets";
import { useCartActions, useCartCount, useCartItems, useCartSubtotal } from "@/store/cart.store";

/** Header cart button with a count badge; opens the cart from the right. */
const CartDrawer = () => {
  const items = useCartItems();
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const { clearCart } = useCartActions();
  const isEmpty = items.length === 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="relative" aria-label={`Cart, ${count} items`}>
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1" aria-hidden="true">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" showCloseButton={false}>
        <div className="border-b">
          <SheetHeader className="flex-row items-center justify-between">
            <SheetTitle>Shopping Cart</SheetTitle>
            <div className="flex items-center gap-1">
              {!isEmpty && (
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <Trash2 data-icon="inline-start" />
                  Clear All
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close cart">
                  <X />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <Image src={assetUrl("/assets/images/empty-cart.png")} alt="" width={190} height={190} />
            <p className="mt-4 text-lg font-bold text-foreground">Your cart is empty.</p>
            <p className="text-sm text-muted-foreground">Please add product to your cart list</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {items.map((item) => (
              <CartItemRow key={item.key} item={item} />
            ))}
          </ul>
        )}

        <div className="border-t">
          <SheetFooter>
            <div className="flex items-center justify-between text-base font-bold text-foreground">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-3">
              <SheetDescription>
                Final price and discounts will be determined at the time of payment processing.
              </SheetDescription>
            </div>
            {isEmpty ? (
              <Button variant="brand" size="lg" className="h-12 w-full" disabled>
                Proceed To Checkout
              </Button>
            ) : (
              <SheetClose asChild>
                <Button asChild variant="brand" size="lg" className="h-12 w-full">
                  <Link href="/checkout">Proceed To Checkout</Link>
                </Button>
              </SheetClose>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
