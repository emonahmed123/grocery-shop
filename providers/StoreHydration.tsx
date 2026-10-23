"use client";

import { useEffect } from "react";

import { CART_STORAGE_KEY, rehydrateCart } from "@/store/cart.store";

/**
 * Loads persisted stores after the first render, so the server HTML and the
 * first client render match. Also keeps the cart in sync across open tabs.
 */
export default function StoreHydration() {
  useEffect(() => {
    rehydrateCart();

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) rehydrateCart();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
