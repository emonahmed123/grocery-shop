import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className='w-full bg-no-repeat bg-cover bg-center flex items-center  bg-fill-thumbnail min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[550px] 2xl:min-h-[650px] py-20 py:pt-24 mb-5   bg-[url("https://borobazar.vercel.app/assets/images/hero/banner-2.png")]  font-manrope'>
      <div className="mx-auto h-full flex flex-col text-center px-6 xl:max-w-[750px] 2xl:max-w-[850px] max-w-[480px] md:max-w-[550px]">
        <div className="text-center">
          <h1 className=" text-3xl md:text-4xl font-manrope font-extrabold leading-snug md:leading-tight xl:leading-[1.3em] mb-3 md:mb-4 xl:mb-3 -mt-2 xl:-mt-3 2xl:-mt-4 text-brand-tree-dark xl:text-5xl 2xl:text-[55px] text-[#0b4635]">
            Healthy Vegetable that you Deserve to Eat Fresh
          </h1>

          <p className="text-base md:text-[17px] xl:text-lg leading-7 md:leading-8 xl:leading-[1.92em] xl:px-16 text-brand-dark text-opacity-80 2xl:px-32 mb-5">
            We source and sell the very best beef, lamb and pork, sourced with
            the greatest care from farmer.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Button
            as={Link}
            href="#product"
            radius="full"
            size="lg"
            variant="shadow"
            className="bg-[#02b290] text-[#FFFFFF] "
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
