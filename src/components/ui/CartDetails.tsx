/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { removeFromCart, updateQuantity } from "@/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/redux/hook";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa6";

import React from "react";
import Image from "next/image";


const CartDetails = ({ product }: any) => {
  const dispatch = useAppDispatch()
  const handleQuantity = (type: string, _id: string) => {
    const payload = { type, _id }
    dispatch(updateQuantity(payload))
  }


  const handleRemove = (_id: string) => {
    const payload = { _id }
    dispatch(removeFromCart(payload))
  }
  return (
    <div className="flex items-center justify-between space-x-4 border border-gray-300 rounded-lg p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg  max-w-[700px] mx-auto">
      <Image width={50} height={50}
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-grow mx-4">
        <h3 className="text-lg font-semibold  truncate mb-2">{product?.name}</h3>
        <p className="text-lg font-bold text-red-600">${product?.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantity("decrement", product?._id)}
          className="bg-primary text-white p-2 rounded-full flex items-center justify-center hover:bg-green-800"
        >
          <FaMinus />

        </button>
        <span className="text-lg font-semibold">{product.quantity}</span>
        <button
          onClick={() => handleQuantity("increment", product._id)}
          className="bg-primary text-white p-2 rounded-full hover:bg-green-800"
        >
          <FaPlus />
        </button>
      </div>
      <button
        onClick={() => handleRemove(product._id)}
        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
      >
        <MdDelete />

      </button>
    </div>
  );
};

export default CartDetails;
