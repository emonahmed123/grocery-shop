import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { type District, getDeliveryFee } from "@/lib/districts";

export type PaymentMethod = "cash-on-delivery" | "card";

type CheckoutActions = {
  selectDistrict: (district: District) => void;
  updateAddress: (address: string) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
};

type CheckoutState = {
  district: District | null;
  /** House, road and area within the district. */
  address: string;
  paymentMethod: PaymentMethod;
  actions: CheckoutActions;
};

// Not persisted: these choices belong to one checkout visit. Shared through a
// store because the checkout steps and the order summary are separate trees.
const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set) => ({
      district: null,
      address: "",
      paymentMethod: "cash-on-delivery",
      actions: {
        selectDistrict: (district) => set({ district }, undefined, "checkout/selectDistrict"),
        updateAddress: (address) => set({ address }, undefined, "checkout/updateAddress"),
        selectPaymentMethod: (paymentMethod) =>
          set({ paymentMethod }, undefined, "checkout/selectPaymentMethod"),
      },
    }),
    { name: "CheckoutStore", enabled: process.env.NODE_ENV !== "production" },
  ),
);

export const useDistrict = () => useCheckoutStore((state) => state.district);

export const useAddress = () => useCheckoutStore((state) => state.address);

export const usePaymentMethod = () => useCheckoutStore((state) => state.paymentMethod);

/** Derived from the district, so it can never disagree with it; `null` until one is picked. */
export const useDeliveryFee = () =>
  useCheckoutStore((state) => (state.district ? getDeliveryFee(state.district) : null));

export const useCheckoutActions = () => useCheckoutStore((state) => state.actions);
