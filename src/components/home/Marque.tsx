import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const Marque = () => {
  return (
    <section className="py-[60px] bg-red-500 ">
      <Marquee
        gradientWidth={20}
        pauseOnHover={true}
        gradient={true}
        speed={100}
        className="max-w-[1440px] mx-auto"
      >
        <ul className="flex  px-5 py-5 items-center justify-around gap-5 min-w-fit flex-shrink-0 text-[26px]">
          <li>
            <Image
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/75ijlxam2V6no5z1jSCJ1694755407.svg"
              alt=""
              width={150}
              height={50}
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/23jEN5x7LDwUK3LvYtcM1694755716.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/LlzrPoopHT7KB7Nb3VYa1694755805.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/YwhnvBpFxnyK8jjS5k211694755994.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/ESmhVK1yQkv7B5EkUNk31694756050.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/coPyfBxCVgqGvVAQxxyP1694756109.svg"
              alt=""
            />
          </li>
        </ul>
        <ul className="flex  px-5 py-5 items-center justify-around gap-5 min-w-fit flex-shrink-0 text-[26px]">
          <li>
            <Image
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/75ijlxam2V6no5z1jSCJ1694755407.svg"
              alt=""
              width={150}
              height={50}
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/23jEN5x7LDwUK3LvYtcM1694755716.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/LlzrPoopHT7KB7Nb3VYa1694755805.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/YwhnvBpFxnyK8jjS5k211694755994.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/ESmhVK1yQkv7B5EkUNk31694756050.svg"
              alt=""
            />
          </li>
          <li>
            <Image
              width={100}
              height={50}
              src="https://besnik-space.fra1.cdn.digitaloceanspaces.com/ezytor/theme/coPyfBxCVgqGvVAQxxyP1694756109.svg"
              alt=""
            />
          </li>
        </ul>
      </Marquee>
    </section>
  );
};

export default Marque;
