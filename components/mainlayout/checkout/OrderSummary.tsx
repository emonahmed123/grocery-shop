"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ProductImage from "@/components/shared/ProductImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/useAuth";
import { usePlaceOrder } from "@/hooks/useCheckout";
import { formatPrice } from "@/lib/assets";
import { isAdmin } from "@/lib/roles";
import { useCartHydrated, useCartItems, useCartSubtotal } from "@/store/cart.store";
import { getCheckoutValues, useDeliveryFee } from "@/store/checkout.store";
import { placeOrderZodSchema } from "@/zod/order.validation";

const OrderSummary = () => {
  const isHydrated = useCartHydrated();
  const items = useCartItems();
  const subtotal = useCartSubtotal();
  const deliveryFee = useDeliveryFee();
  const router = useRouter();
  const { data: user, isPending: isUserPending } = useMe();
  const placeOrder = usePlaceOrder();
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
    if (!user) {
      toast.info("Please log in to place your order");
      router.push("/login?redirect=/checkout");
      return;
    }
    if (isAdmin(user)) {
      toast.error("Admin accounts cannot place orders. Log in with a customer account.");
      return;
    }

    const { district, address, phone, paymentMethod, note, leaveAtDoor } = getCheckoutValues();
    const payload = {
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        ...(item.variation ? { variation: item.variation } : {}),
      })),
      shippingAddress: { district: district ?? "", address, phone },
      deliveryInstructions: { note: note.trim() || undefined, leaveAtDoor },
      paymentMethod,
    };

    // Same checks as the server, so mistakes show up before a request is sent.
    const parsed = placeOrderZodSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your order details");
      return;
    }
    placeOrder.mutate(parsed.data);
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
                  <ProductImage
                    src={item.image}
                    alt={item.name}
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
          disabled={items.length === 0 || isUserPending || placeOrder.isPending}
          onClick={handleOrder}
        >
          {placeOrder.isPending && <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />}
          {placeOrder.isPending ? "Placing order..." : "Order Now"}
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
        . You pay in cash when the order arrives; the final total is confirmed when the order is placed.
      </p>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        A bag fee may be added to your final total if required by law or the
        retailer. The fee will be visible on your receipt after delivery.
      </p>
    </aside>
  );
};

export default OrderSummary;
