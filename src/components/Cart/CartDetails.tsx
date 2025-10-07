/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  removeFromCart,
  updateQuantity,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/redux/hook";
import { FaMinus, FaPlus } from "react-icons/fa6";

import Image from "next/image";

const CartDetails = ({ product }: any) => {
  const dispatch = useAppDispatch();
  const handleQuantity = (type: string, _id: string) => {
    const payload = { type, _id };
    dispatch(updateQuantity(payload));
  };

  const handleRemove = (_id: string) => {
    const payload = { _id };
    dispatch(removeFromCart(payload));
  };
  return (
    <li className="flex py-4 border-b last:border-b-0">
      <div className="flex-shrink-0 mr-4">
        <Image
          width={40}
          height={40}
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </div>
      <div className="flex-grow flex-col ">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-brand">
            {product?.name}
          </h3>

          <p className="text-lg font-semibold text-gray-800">
            ৳{product?.price}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantity("decrement", product?._id)}
              className="bg-primary text-white p-2 rounded-full flex items-center justify-center hover:bg-green-800"
            >
              <FaMinus size={10} />
            </button>
            <span className="text-lg font-semibold">{product.quantity}</span>
            <button
              onClick={() => handleQuantity("increment", product._id)}
              className="bg-primary text-white p-2 rounded-full hover:bg-green-800"
            >
              <FaPlus size={10} />
            </button>
          </div>

          <button
            onClick={() => handleRemove(product._id)}
            className="text-red-500  p-2 rounded-full"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartDetails;
