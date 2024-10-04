// import Cart from '@/components/ui/Cart';
import Cart from "@/components/ui/Cart";
import OrderSummary from "@/components/ui/OrderSummary";
import React from "react";

const Cartpage = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-5 xl:px-0 gap-5 py-[50px] md:py-[90px] flex flex-col  md:flex-row justify-between items-center">
      <Cart></Cart>
      <OrderSummary />
    </div>
  );
};

export default Cartpage;
