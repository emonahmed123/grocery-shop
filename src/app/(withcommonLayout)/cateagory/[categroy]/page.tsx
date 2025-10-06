/* eslint-disable @typescript-eslint/no-explicit-any */
import Eeaer from "@/components/about/Eeaer";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import React from "react";

type search = {
  category: string;
};

const Categorey = async (props: { searchParams: Promise<search> }) => {
  const searchParams = await props.searchParams;
  const { category } = searchParams;

  const res = await fetch(
    `https://grocery-store-server-orpin.vercel.app/api/product?category=${category}`,
    {
      cache: "no-store",
    }
  );

  const product = await res.json();

  return (
    <>
      <div className=" py-10  md:py-10">
        <div className="max-w-[1170px] px-5 xl:px-0 mx-auto">
          <Link
            href="/"
            className="text-[14px] leading-6 text-gray-400 pb-10  inline-block"
          >
            Category &gt; <span className="text-primary">{category}</span>
          </Link>

          <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-5">
            {product?.data?.map((item: any, i: string) => (
              <ProductCard item={item} key={i}></ProductCard>
            ))}
          </div>
        </div>
      </div>

      <Eeaer />
    </>
  );
};

export default Categorey;
