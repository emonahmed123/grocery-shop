import Image from "next/image";
import React from "react";

const Eeaer = () => {
  return (
    <div className="bg-[#f2f2f2] opacity-100 overflow-hidden pt-1.5 md:pt-0 font-poppe">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-16 xl:px-28 2xl:px-32 3xl:px-40 md:flex justify-between items-center">
        <div className="shrink-0 mx-auto md:ltr:ml-0 md:rtl:mr-0 lg:flex lg:items-center pb-5 pt-1.5 md:pt-4 max-w-[350px] md:max-w-[340px] lg:max-w-[485px] xl:max-w-[540px] 2xl:max-w-[680px] 3xl:ltr:pl-10 3xl:rtl:pr-10">
          <div className="py-8 text-center xl:py-10 2xl:py-14 md:text-left md:rtl:text-right">
            <h2 className="text-[22px] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-9 lg:leading-[1.4em] xl:leading-[1.45em] text-brand-dark font-bold font-manrope -tracking-[0.2px] mb-3 lg:mb-4">
              Make your online shop easier with our Shop
            </h2>
            <p className="text-15px xl:text-base 2xl:text-[17px] leading-7 xl:leading-9 text-brand-dark text-opacity-70 pb-5 lg:pb-7 ltr:pr-0 rtl:pl-0 xl:ltr:pr-8 xl:rtl:pl-8 2xl:ltr:pr-20 2xl:rtl:pl-20">
              BoroBazar makes online grocery shopping fast and easy. Get
              groceries delivered and order the best of seasonal farm fresh
              food.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-end ltr:pl-4 rtl:pr-4 2xl:ltr:pl-0 2xl:rtl:pr-0 md:max-w-[480px] lg:max-w-[540px] xl:max-w-auto ltr:-mr-16 rtl:-ml-16 lg:ltr:-mr-8 lg:rtl:-ml-8 3xl:ltr:mr-24 3xl:rtl:ml-24">
          <Image
            width={597}
            height={500}
            src="https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fapp-thumbnail.png&w=640&q=75"
            alt="png"
          />
        </div>
      </div>
    </div>
  );
};

export default Eeaer;
