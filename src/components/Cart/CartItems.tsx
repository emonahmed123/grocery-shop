/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector } from "@/redux/hook";
import CartDetails from "./CartDetails";
const CartItems = () => {
  const products = useAppSelector((store) => store.cart.products);

  return (
    <>
      <div className="flex flex-col p-3 ">
        <ul className="flex flex-col divide-y">
          {products.map((product: any) => (
            <CartDetails key={product._id} product={product} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default CartItems;
