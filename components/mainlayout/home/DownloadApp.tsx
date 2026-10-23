import Container from "@/components/mainlayout/layout/Container";
import { assetUrl } from "@/lib/assets";
import Image from "next/image";

const DownloadApp = () => {
  return (
    <section className="overflow-hidden bg-fill-neutral pt-1.5 md:pt-0">
      <Container className="items-center justify-between md:flex lg:px-16 xl:px-28">
        <div className="mx-auto max-w-88 shrink-0 pt-1.5 pb-5 md:mx-0 md:max-w-85 md:pt-4 lg:max-w-121 xl:max-w-135">
          <div className="py-8 text-center md:text-left xl:py-10">
            <h2 className="mb-3 font-manrope text-2xl leading-9 font-bold text-foreground lg:mb-4 lg:text-3xl lg:leading-snug xl:text-4xl">
              Make your online shop easier with our mobile app
            </h2>
            <p className="text-base leading-7 text-muted-foreground xl:pr-8 xl:leading-9">
              BoroBazar makes online grocery shopping fast and easy. Get
              groceries delivered and order the best of seasonal farm fresh
              food.
            </p>
          </div>
        </div>
        <div className="-mr-16 hidden items-end pl-4 md:flex md:max-w-120 lg:-mr-8 lg:max-w-135">
          <Image
            src={assetUrl("/assets/images/app-thumbnail.png")}
            alt="Shopper holding a bag of groceries"
            width={597}
            height={500}
          />
        </div>
      </Container>
    </section>
  );
};

export default DownloadApp;
