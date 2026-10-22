"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { assetUrl, formatPrice } from "@/lib/assets";
import { useCartHydrated, useCartItems, useCartSubtotal } from "@/store/cart.store";
import { useAddress, useDeliveryFee, useDistrict } from "@/store/checkout.store";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const OrderSummary = () => {
  const isHydrated = useCartHydrated();
  const items = useCartItems();
  const subtotal = useCartSubtotal();
  const district = useDistrict();
  const address = useAddress();
  const deliveryFee = useDeliveryFee();
  // No delivery charge on an empty cart, or before a district is picked.
  const shipping = items.length > 0 ? (deliveryFee ?? 0) : 0;
  const totals = [
    { label: "Subtotal", value: formatPrice(subtotal) },
    {
      label: "Delivery Charge",
      value: deliveryFee === null ? "Select district" : formatPrice(shipping),
    },
    { label: "Total", value: formatPrice(subtotal + shipping) },
  ];

  const handleOrder = () => {
    if (!district || !address.trim()) {
      toast.error("Please add your district and address first");
      return;
    }
    // No orders API yet; the cart stays intact until it is connected.
    toast.info("Ordering will be available soon");
  };

  return (
    <aside>
      <div className="rounded-md border px-6 py-7 xl:px-7">
        <div className="flex justify-between pb-2 text-sm font-medium text-foreground md:text-base">
          <span>Product</span>
          <span>Subtotal</span>
        </div>

        {/* Until the saved cart loads, a skeleton avoids flashing "empty". */}
        {!isHydrated ? (
          <div className="flex flex-col gap-3 border-b py-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="border-b py-6 text-center text-sm text-muted-foreground">
            Your cart is empty.{" "}
            <Link href="/search" className="font-medium text-brand underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-4 border-b py-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={assetUrl(item.image)}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm leading-6 text-foreground">
                  {item.name}
                  {item.variation && ` (${item.variation})`}{" "}
                  <span className="text-muted-foreground">x {item.quantity}</span>
                </p>
                <span className="ml-auto shrink-0 text-sm font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl>
          {totals.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b py-4 text-sm font-medium text-foreground last:border-b-0 last:pb-0 last:text-base lg:py-5"
            >
              <dt>{label}</dt>
              <dd className="font-normal">{value}</dd>
            </div>
          ))}
        </dl>

        <Button
          variant="brand"
          size="lg"
          className="mt-8 w-full"
          disabled={items.length === 0}
          onClick={handleOrder}
        >
          Order Now
        </Button>
      </div>

      <p className="mt-8 text-sm leading-7 text-muted-foreground">
        By placing your order, you agree to be bound by the BoroBazar{" "}
        <Link href="/terms" className="font-medium text-brand underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-brand underline">
          Privacy
        </Link>
        . Your credit/debit card data will not be saved.
      </p>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        A bag fee may be added to your final total if required by law or the
        retailer. The fee will be visible on your receipt after delivery.
      </p>
    </aside>
  );
};

export default OrderSummary;
