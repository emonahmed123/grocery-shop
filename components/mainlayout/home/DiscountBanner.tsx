import Container from "@/components/mainlayout/layout/Container";
import { assetUrl } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";

// The headline and "Explore More" button are part of the banner artwork.
const DiscountBanner = () => {
  return (
    <Container className="mb-12 lg:mb-14">
      <Link
        href="/search"
        className="group block overflow-hidden rounded-md"
        aria-label="Super Discount 70% Off"
      >
        <Image
          src={assetUrl("/assets/images/banner/banner-7.png")}
          alt="Super Discount 70% Off"
          width={1840}
          height={400}
          sizes="(min-width: 1440px) 1376px, 100vw"
          className="hidden h-auto w-full transition duration-300 group-hover:scale-105 sm:block"
        />
        <Image
          src={assetUrl("/assets/images/banner/banner-mobile-7.png")}
          alt="Super Discount 70% Off"
          width={450}
          height={400}
          sizes="100vw"
          className="h-auto w-full sm:hidden"
        />
      </Link>
    </Container>
  );
};

export default DiscountBanner;
