import Image from "next/image";

import { Button } from "@/components/ui/button";
import heroBanner from "@/public/images/banner-2.png";

const Banner = () => {
  return (
    <div className="relative isolate w-full overflow-hidden flex items-center min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[550px] 2xl:min-h-[650px] py-20 py:pt-24 mb-5 font-manrope">
      {/* LCP image: next/image serves resized WebP per viewport, preloads it and shows a blur until it loads. */}
      <Image
        src={heroBanner}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={75}
        placeholder="blur"
        className="-z-10 object-cover object-center"
      />
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
          <Button className=" rounded-full py-5 text-[#FFFFFF]  hover:bg-amber-600">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
