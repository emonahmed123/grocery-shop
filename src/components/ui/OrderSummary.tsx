
"use client"


import { clearCart } from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";



const OrderSummary = () => {
  const dispatch = useAppDispatch()
  const { totalPrice, selectedItems } = useAppSelector((store) => store.cart)
  const handleClearCart = () => {
    dispatch(clearCart())
  }
  return (
    <div className=" lg:w-80 xl:w-[600px] w-full h-full bg-primary bg-opacity-35 rounded">
      <div className="px-6 py-4 space-y-10">
        <h1 className="text-2xl font-semibold text-dark">Order Summary</h1>
        <p className="text-sm text-dark mt-2">
          Selected Items : {selectedItems}
        </p>
        <p className="text-sm text-dark mt-2">
          Total Price : ${totalPrice.toFixed(3)}
        </p>


      </div>
      <div className="px-4 pb-6">
        {" "}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="bg-red-500 px-3 py-2 text-white  mt-2 rounded-md w-full text-xs flex justify-between items-center mb-4"
        >
          <span>Clear Cart</span>

        </button>
        <Button as={Link}
          href="/checkout
"
          className="bg-green-600 px-3 py-2 text-white  mt-2 rounded-md w-full text-xs flex justify-between items-center"
        >
          <span>Proceed Checkout</span>

        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
