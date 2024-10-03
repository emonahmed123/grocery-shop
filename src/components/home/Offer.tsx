import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Offer = () => {
  return (
    <section className="py-[50px]  md:py-[80px]  font-poppe">
      <div className="max-w-[1110px] px-5 mx-auto py-[100px] bg-[url('https://groceries-mart.myshopify.com/cdn/shop/files/Untitled-11_e0592d68-4ca5-4033-9e87-4db7ec657745.jpg?v=1678787485&width=1500')] bg-no-repeat bg-right lg:bg-center bg-cover">
        <div className="flex justify-end ">
          <div>
            <h2 className="text-[30px] italic font-semibold text-white mb-1  md:mb-2">
              Special Offer
            </h2>
            <h2 className="text-[60px] font-bold text-white mb-5">
              get 50% off
            </h2>
            <Button as={Link} href="/products" color="warning">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
