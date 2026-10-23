import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { type District, getDeliveryFee } from "@/lib/districts";

export type PaymentMethod = "cash-on-delivery" | "card";

type CheckoutActions = {
  selectDistrict: (district: District) => void;
  updateAddress: (address: string) => void;
  updatePhone: (phone: string) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  updateNote: (note: string) => void;
  setLeaveAtDoor: (leaveAtDoor: boolean) => void;
  /** Clears the form after an order is placed. */
  reset: () => void;
};

type CheckoutValues = {
  district: District | null;
  /** House, road and area within the district. */
  address: string;
  phone: string;
  paymentMethod: PaymentMethod;
  note: string;
  leaveAtDoor: boolean;
};

type CheckoutState = CheckoutValues & { actions: CheckoutActions };

const INITIAL_VALUES: CheckoutValues = {
  district: null,
  address: "",
  phone: "",
  paymentMethod: "cash-on-delivery",
  note: "",
  leaveAtDoor: false,
};

// Not persisted: these choices belong to one checkout visit. Shared through a
// store because the checkout steps and the order summary are separate trees.
const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set) => ({
      ...INITIAL_VALUES,
      actions: {
        selectDistrict: (district) => set({ district }, undefined, "checkout/selectDistrict"),
        updateAddress: (address) => set({ address }, undefined, "checkout/updateAddress"),
        updatePhone: (phone) => set({ phone }, undefined, "checkout/updatePhone"),
        selectPaymentMethod: (paymentMethod) =>
          set({ paymentMethod }, undefined, "checkout/selectPaymentMethod"),
        updateNote: (note) => set({ note }, undefined, "checkout/updateNote"),
        setLeaveAtDoor: (leaveAtDoor) => set({ leaveAtDoor }, undefined, "checkout/setLeaveAtDoor"),
        reset: () => set(INITIAL_VALUES, undefined, "checkout/reset"),
      },
    }),
    { name: "CheckoutStore", enabled: process.env.NODE_ENV !== "production" },
  ),
);

export const useDistrict = () => useCheckoutStore((state) => state.district);

export const useAddress = () => useCheckoutStore((state) => state.address);

export const usePhone = () => useCheckoutStore((state) => state.phone);

export const usePaymentMethod = () => useCheckoutStore((state) => state.paymentMethod);

export const useNote = () => useCheckoutStore((state) => state.note);

export const useLeaveAtDoor = () => useCheckoutStore((state) => state.leaveAtDoor);

/** Derived from the district, so it can never disagree with it; `null` until one is picked. */
export const useDeliveryFee = () =>
  useCheckoutStore((state) => (state.district ? getDeliveryFee(state.district) : null));

export const useCheckoutActions = () => useCheckoutStore((state) => state.actions);

/** Everything the order needs, read once when "Order Now" is pressed. */
export const getCheckoutValues = (): CheckoutValues => {
  const { district, address, phone, paymentMethod, note, leaveAtDoor } = useCheckoutStore.getState();
  return { district, address, phone, paymentMethod, note, leaveAtDoor };
};
