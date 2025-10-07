"use client";

import { useAuth } from "@/lib/AuthProviders";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

import Link from "next/link";
import { Button } from "../ui/button";
import { SheetClose } from "../ui/sheet";

const OrderSummary = () => {
  const { user } = useAuth();

  const dispatch = useAppDispatch();
  const { totalPrice } = useAppSelector((store) => store.cart);
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <div className="mt-auto">
      <div className="text-right">
        <p className="text-xl">
          Total amount: {""}
          <span className="font-semibold">{totalPrice.toFixed(2)}Tk</span>
        </p>
        <p className="text-sm">Not including taxes and shipping costs</p>
      </div>
      <div className="flex justify-end space-x-4 mt-4 items-center">
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
        >
          Clear Cart
        </Button>
        <SheetClose asChild>
          <Link href="/product">
            <Button className="bg-black">Back to shop</Button>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          {user ? (
            <Link href="/checkout" className="bg-primary">
              <Button className="px-6 py-2 bg-brand hover:bg-brand/90">
                Continue to Checkout
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="px-6 py-2 bg-brand hover:bg-brand/90 bg-primary">
                Continue to Checkout
              </Button>
            </Link>
          )}
        </SheetClose>
      </div>
    </div>
  );
};

export default OrderSummary;
