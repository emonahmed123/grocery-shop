/* eslint-disable @typescript-eslint/no-explicit-any */
import AddButtonCart from "@/components/ui/AddButtonCart";
import DelteteBtn from "@/components/ui/delteteBtn";
import QuantityBtn from "@/components/ui/QuantiryBtn";

import Image from "next/image";
import React from "react";
import Review from "./review";

// export async function generateStaticParams() {
//     return []
// }

const ProductDetails = async ({ params }: any) => {
  const res = await fetch(
    `https://grocery-store-server-orpin.vercel.app/api/product/${params.productId}`,
    {
      cache: "no-store",
    }
  );

  const Products = await res.json();
  const product = Products?.data;
  return (
    <section className="py-[90px] md:py-[50px]">
      <div className="max-w-Container mx-auto px-5 xl:px-0 font-poppe">
        <p className="mb-5 text-sm text-gray-500">
          {product.category} &gt; {product.name}
        </p>

        <div className="flex justify-between gap-5 flex-col md:flex-row lg:gap-x-6 items-center">
          <div className="w-[330px] md:w-[500px] h-[300px] md:h-[450px]">
            <Image
              className="object-cover h-full w-full"
              src={product.image}
              width={500}
              height={100}
              alt="product image"
            ></Image>
          </div>

          <div className="max-w-[600px]">
            <div className="border-b pb-2 mb-2">
              <h1 className="text-3xl  md:text-[40px] mb-3 font-semibold">
                {product?.name}{" "}
              </h1>

              <p className="text-xl mb-3 font-medium">{product?.price}TK</p>
            </div>

            <p className="text-[16px] mb-5"> {product?.description}</p>

            <div className="flex gap-x-3">
              <QuantityBtn productId={product?._id} />
              <DelteteBtn deletedId={product?._id} />

              <AddButtonCart product={product}>Add to cart</AddButtonCart>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Review productId={params.productId} />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
