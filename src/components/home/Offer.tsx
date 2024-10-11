import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Offer = () => {
  return (
    <section className="  font-poppe  px-5">
      <div className="max-w-[1900px] mx-auto py-[100px] bg-[url('https://groceries-mart.myshopify.com/cdn/shop/files/Untitled-11_e0592d68-4ca5-4033-9e87-4db7ec657745.jpg?v=1678787485&width=1500')] bg-no-repeat bg-right lg:bg-center bg-cover">
        <div className="flex justify-end px-5">
          <div>
            <h2 className="text-[30px] italic font-semibold text-white mb-1  md:mb-2">
              Special Offer
            </h2>
            <h2 className="text-[50px] sm:text-[60px] font-bold text-white mb-3 sm:mb-5">
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
