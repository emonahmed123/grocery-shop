/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@nextui-org/react";
import Link from "next/link";

import ProductCard from "../ui/ProductCard";

const PopularProducts = async () => {
  const res = await fetch(
    "https://grocery-store-server-orpin.vercel.app/api/product",
    {
      cache: "no-store",
    }
  );
  const products = await res.json();

  return (
    <section className=" py-[50px] md:py-[80px] font-manrope">
      <div className="max-w-[1170px] mx-auto px-5 xl:px-0 " id="product">
        <div className="flex flex-col md:flex-row  items-start gap-y-4  md:items-center justify-center mb-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold gradient font-poppe">
              Most Popular Products
            </h2>
            <p className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loos w-full md:w-1/2">
              Discover our top categories, featuring everything from fresh
              produce to pantry essentials. We’ve curated the best products to
              keep your meals delicious and your kitchen stocked with quality
              ingredients.
            </p>
          </div>
          <Button
            as={Link}
            href="/product"
            className="bg-[#02b290] min-w-[127px] h-[46px] text-[#FFFFFF] py-[8px] px-[8px]  text-[18px] shadow-16  "
          >
            View All
          </Button>
        </div>
        <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-5">
          {products?.data?.slice(0, 12).map((item: any) => (
            <ProductCard item={item} key={item._id}></ProductCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
