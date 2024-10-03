import ProductCard from "@/components/ui/ProductCard";
import { TGroceryItem } from "@/Types";

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
      <div className="max-w-Container mx-auto px-5 xl:px-0">
        <div className="flex flex-col md:flex-row  items-start gap-y-4  md:items-center justify-center mb-10">
          <h2 className="text-3xl font-semibold gradient text-center">
            All Products
          </h2>
        </div>
        <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-3 gap-5">
          {products?.data?.map((item: TGroceryItem, i: number) => (
            <ProductCard item={item} key={i}></ProductCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Productpage;
