/* eslint-disable @typescript-eslint/no-explicit-any */
import AddButtonCart from "@/components/ui/AddButtonCart";
import DelteteBtn from "@/components/ui/delteteBtn";
import QuantityBtn from "@/components/ui/QuantiryBtn";

import Image from "next/image";
import React from "react";
import Review from "./review";
import Eeaer from "@/components/about/Eeaer";

// export async function generateStaticParams() {
//     return []
// }

const ProductDetails = async (props: any) => {
  const params = await props.params;
  const res = await fetch(
    `https://grocery-store-server-orpin.vercel.app/api/product/${params.productId}`,
    {
      cache: "no-store",
    }
  );

  const Products = await res.json();
  const product = Products?.data;
  return (
    <>
      <section className="py-[50px] md:py-[80px]">
        <div className="max-w-[1170px] mx-auto px-5 xl:px-0 font-poppe">
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

            <div className="max-w-[600px] ">
              <div className="border-b pb-2 mb-2">
                <h1 className="text-3xl  md:text-[40px] mb-3 font-semibold">
                  {product?.name}{" "}
                </h1>

                <p className="text-xl mb-3 font-medium">{product?.price}TK</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 220 40"
                  width="90"
                  height="20"
                >
                  <defs>
                    <symbol id="star" viewBox="0 0 24 24">
                      <path d="M12 .587l3.668 7.429L23.524 9.75l-5.68 5.535L19.812 24 12 19.797 4.188 24l1.968-8.715-5.68-5.535 7.856-1.734L12 .587z" />
                    </symbol>
                  </defs>
                  <g fill="gold">
                    <use href="#star" x="0" y="0" width="24" height="24" />
                    <use href="#star" x="44" y="0" width="24" height="24" />
                    <use href="#star" x="88" y="0" width="24" height="24" />
                    <use href="#star" x="132" y="0" width="24" height="24" />
                    <use href="#star" x="176" y="0" width="24" height="24" />
                  </g>
                </svg>
              </div>

              <p className="text-[16px] mb-5"> {product?.description}</p>

              <div className="flex gap-x-3">
                <QuantityBtn productId={product?._id} />
                <DelteteBtn deletedId={product?._id} />

                <AddButtonCart product={product}>Add cart</AddButtonCart>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <Review productId={params.productId} />
          </div>
        </div>
      </section>

      <Eeaer />
    </>
  );
};

export default ProductDetails;
