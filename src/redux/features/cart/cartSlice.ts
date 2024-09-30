/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGroceryItem } from "@/Types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [] as any,
  selectedItems: 0,
  totalPrice: 0,
  deliveryCharge: 15,
  grandTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* The `addToCart` function in the code snippet is a Redux reducer function that handles adding a
   new item to the cart. Here's a breakdown of what it does: */
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product: TGroceryItem) => product._id === action.payload._id
      );
      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.grandTotal = selectGrandTotal(state);
    },
    /* The `updateQuantity` function in the code snippet is a Redux reducer function that handles updating
 the quantity of a specific item in the cart. Here's a breakdown of what it does: */
    updateQuantity: (state: any, action) => {
      const products = state.products.map((product: any) => {
        if (product._id === action.payload._id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (action.payload.type === "decrement") {
            if (product.quantity > 1) {
              product.quantity -= 1;
            } else {
              product.quantity = 1;
            }
          }
        }
        return product;
      });
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.grandTotal = selectGrandTotal(state);
    },
    /* The `removeFromCart` function in the code snippet is a Redux reducer function that handles removing
 a specific item from the cart. Here's a breakdown of what it does: */
    removeFromCart: (state, action) => {
      console.log("Product _id to remove:", action.payload._id);
      state.products = state.products.filter(
        (product: TGroceryItem) => product._id !== action.payload._id
      );
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.grandTotal = 0;
    },
  },
});

export const selectSelectedItems = (state: any) =>
  state.products.reduce((total: number, product: any) => {
    return Number(total + product.quantity);
  }, 0);

export const selectTotalPrice = (state: any) =>
  state.products.reduce((total: number, product: any) => {
    return Number(total + product.quantity * product.price);
  }, 0);

export const selectGrandTotal = (state: any) => {
  return selectTotalPrice(state) + state.deliveryCharge;
};

export const selectProductQuantity = (state: any, productId: string) => {
  const product = state.cart.products?.find(
    (product: any) => product._id === productId
  );
  return product ? product.quantity : 0;
};

export const { addToCart, updateQuantity, clearCart, removeFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
