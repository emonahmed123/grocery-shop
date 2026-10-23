import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { Product } from "@/types/product";

/**
 * A snapshot of what the cart needs to render, so the drawer and checkout work
 * without loading the whole catalog in the browser.
 */
export type CartItem = {
  /** One line per product and variation, e.g. `<id>` or `<id>:Large`. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unit: string;
  /** Unit price when it was added; the backend prices the order again. */
  price: number;
  variation?: string;
  quantity: number;
  /** Stock when it was added, so the counter cannot go past it. */
  stock: number;
};

type AddItemOptions = {
  quantity?: number;
  variation?: string;
};

type CartActions = {
  addItem: (product: Product, options?: AddItemOptions) => void;
  increaseItem: (key: string) => void;
  decreaseItem: (key: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

type CartState = {
  items: CartItem[];
  // Actions live in their own object: it never changes, so components that
  // only need actions never re-render when the cart does.
  actions: CartActions;
};

/** localStorage key; also used to sync the cart across tabs. */
export const CART_STORAGE_KEY = "borobazar-cart";

export const getCartItemKey = (productId: string, variation?: string) =>
  variation ? `${productId}:${variation}` : String(productId);

// The store itself is private; components use the hooks below, which keeps
// every subscription selector-based.
const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        actions: {
          addItem: (product, { quantity = 1, variation } = {}) =>
            set(
              (state) => {
                const key = getCartItemKey(product.id, variation);
                const existing = state.items.find((item) => item.key === key);
                if (existing) {
                  return {
                    items: state.items.map((item) =>
                      item.key === key
                        ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                        : item,
                    ),
                  };
                }

                const item: CartItem = {
                  key,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  unit: product.unit,
                  price: product.currentPrice,
                  variation,
                  quantity: Math.min(quantity, product.inStock),
                  stock: product.inStock,
                };
                return { items: [...state.items, item] };
              },
              undefined,
              "cart/addItem",
            ),

          increaseItem: (key) =>
            set(
              (state) => ({
                items: state.items.map((item) =>
                  item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } : item,
                ),
              }),
              undefined,
              "cart/increaseItem",
            ),

          // Going below one removes the line, like the reference counter.
          decreaseItem: (key) =>
            set(
              (state) => ({
                items: state.items
                  .map((item) => (item.key === key ? { ...item, quantity: item.quantity - 1 } : item))
                  .filter((item) => item.quantity > 0),
              }),
              undefined,
              "cart/decreaseItem",
            ),

          removeItem: (key) =>
            set(
              (state) => ({ items: state.items.filter((item) => item.key !== key) }),
              undefined,
              "cart/removeItem",
            ),

          clearCart: () => set({ items: [] }, undefined, "cart/clearCart"),
        },
      }),
      {
        name: CART_STORAGE_KEY,
        // Version 1 held demo products with numeric ids that the backend does
        // not know, so those carts start empty.
        version: 2,
        migrate: () => ({ items: [] }),
        storage: createJSONStorage(() => localStorage),
        // Persist data only; actions are recreated on every load.
        partialize: (state) => ({ items: state.items }),
        // The server renders an empty cart, so the browser waits until after
        // the first render to read localStorage. This avoids hydration errors.
        skipHydration: true,
      },
    ),
    { name: "CartStore", enabled: process.env.NODE_ENV !== "production" },
  ),
);

// ---- Hooks: the only way components read or change the cart ----

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartActions = () => useCartStore((state) => state.actions);

/** Total number of units, for the header badge. */
export const useCartCount = () =>
  useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));

export const useCartSubtotal = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

/** Quantity of one cart line, or 0 when it is not in the cart. */
export const useCartItemQuantity = (key: string) =>
  useCartStore((state) => state.items.find((item) => item.key === key)?.quantity ?? 0);

// `persist` only exists in the browser (no localStorage on the server), so it
// is read inside these callbacks, which React calls on the client only.
const subscribeToHydration = (onChange: () => void) =>
  useCartStore.persist.onFinishHydration(onChange);
const getHydrated = () => useCartStore.persist.hasHydrated();

/** False until the saved cart has been read from localStorage. */
export const useCartHydrated = () =>
  useSyncExternalStore(subscribeToHydration, getHydrated, () => false);

/** Loads the saved cart; call once on the client after mount. */
export const rehydrateCart = () => useCartStore.persist.rehydrate();
