import SimpelFilter from "@/components/SimpelFilter/SimpelFilter";

import React from "react";

const Productpage = async () => {
  const res = await fetch(
    "https://grocery-store-server-orpin.vercel.app/api/product",
    {
      cache: "no-store",
    }
  );
  const products = await res.json();

  return (
    <section className=" py-[50px] md:py-[80px]">
      <div className="max-w-[1170px] mx-auto px-5 xl:px-0">
        <div className="flex flex-col md:flex-row  items-start gap-y-4  md:items-center justify-center mb-10">
          <h2 className="text-3xl font-semibold gradient text-center">
            All Products
          </h2>
        </div>
        <div>
          <SimpelFilter data={products?.data} />
        </div>
      </div>
    </section>
  );
};

export default Productpage;
