"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { placeOrderAction } from "@/actions/order.actions";
import { formatPrice } from "@/lib/assets";
import { unwrapResult } from "@/queries/unwrapResult";
import { useCartActions } from "@/store/cart.store";
import { useCheckoutActions } from "@/store/checkout.store";
import type { IPlaceOrderPayload } from "@/zod/order.validation";

/** Places the order, then empties the cart and opens "My Orders". */
export function usePlaceOrder() {
  const router = useRouter();
  const { clearCart } = useCartActions();
  const { reset } = useCheckoutActions();

  return useMutation({
    mutationFn: (payload: IPlaceOrderPayload) => unwrapResult(placeOrderAction(payload)),
    onSuccess: (order) => {
      clearCart();
      reset();
      // The backend prices the order, so its total is the one to show.
      toast.success(`Order placed! Total ${formatPrice(order.totalAmount)}, paid on delivery.`);
      router.push("/my-account/orders");
    },
    onError: (error) => toast.error(error.message),
  });
}
