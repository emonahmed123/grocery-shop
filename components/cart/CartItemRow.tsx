"use client";

import Image from "next/image";
import Link from "next/link";

import QuantityCounter from "@/components/cart/QuantityCounter";
import { SheetClose } from "@/components/ui/sheet";
import { assetUrl, formatPrice } from "@/lib/assets";
import { type CartItem, useCartActions } from "@/store/cart.store";

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { increaseItem, decreaseItem } = useCartActions();
  const href = `/products/${item.slug}`;

  return (
    <li className="flex gap-4 py-4">
      <SheetClose asChild>
        <Link href={href} className="relative size-18 shrink-0 overflow-hidden rounded-md bg-fill-thumbnail">
          <Image src={assetUrl(item.image)} alt={item.name} fill sizes="72px" className="object-contain" />
        </Link>
      </SheetClose>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <SheetClose asChild>
          <Link href={href} className="text-sm leading-5 text-foreground hover:text-brand">
            {item.name}
          </Link>
        </SheetClose>
        <p className="text-xs text-muted-foreground">
          {item.unit} X {item.quantity}
          {item.variation && ` · ${item.variation}`}
        </p>
        <QuantityCounter
          variant="compact"
          quantity={item.quantity}
          label={item.name}
          onDecrease={() => decreaseItem(item.key)}
          onIncrease={() => increaseItem(item.key)}
        />
      </div>

      <span className="shrink-0 text-sm font-semibold text-foreground">
        {formatPrice(item.price * item.quantity)}
      </span>
    </li>
  );
};

export default CartItemRow;
