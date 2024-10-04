import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className=' h-screen md:h-[650px]  bg-[url("https://i.ibb.co/bmFLW7G/banner.jpg")] bg-cover bg-no-repeat font-poppe'>
      <div className="w-full bg-[#ffffffc2] h-full  flex justify-center items-center font-poppe">
        <div className="max-w-[900px] mx-auto px-2">
          <h1 className=" text-[26px] leading-[36px] md:text-[50px] md:leading-[60px] lg:text-[70px] lg:leading-[80px] font-bold text-center mb-3 md:mb-6 font-poppe">
            Your Local Marketplace for Fresh and Sustainable Good
          </h1>

          <p className="text-[16px] text-black leading-[27px] text-center  mb-3 md:mb-6">
            At Growcery, we connect you with local farmers, artisans, and small
            businesses to bring fresh, organic, and sustainable products
            straight to your door. From farm-fresh vegetables to handmade goods,
            our marketplace supports local producers while providing you with
            the healthiest and freshest options available!
          </p>
          <div className="flex justify-center items-center">
            <Button
              as={Link}
              href="#product"
              radius="full"
              size="lg"
              variant="shadow"
              className="bg-gradient-to-tr from-primary to-yellow-500 text-white shadow-lg"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
