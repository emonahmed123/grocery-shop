/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { TGroceryItem } from "@/Types";
const SimpelFilter = ({ data }: { data: any }) => {
  // console.log(data);

  const [searchTerm, setSearchTerm] = useState("");

  const filterFacilites = data?.filter((data: any) =>
    data?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-[600px] mx-auto mb-10">
        <input
          value={searchTerm}
          type="search"
          placeholder=" Search Product Name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-5">
        {filterFacilites.map((item: TGroceryItem, i: number) => (
          <ProductCard item={item} key={i}></ProductCard>
        ))}
      </div>
    </div>
  );
};

export default SimpelFilter;
