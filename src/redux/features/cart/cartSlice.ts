/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGroceryItem } from "@/Types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [] as any,
  selectedItems: 0,
  totalPrice: 0,
  grandTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product: TGroceryItem) => product.id === action.payload.id
      );
      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.grandTotal = selectGrandTotal(state);
    },
    updateQuantity: (state: any, action) => {
      const products = state.products.map((product: any) => {
        if (product.id === action.payload.id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (action.payload.type === "decrement") {
            if (product.quantity > 0) {
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
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
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

export const selectTax = (state: any) =>
  selectTotalPrice(state) * state.taxRate;

export const selectGrandTotal = (state: any) => {
  return selectTotalPrice(state) + selectTotalPrice(state) * state.taxRate;
};
export const { addToCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
