import Container from "@/components/mainlayout/layout/Container";
import { assetUrl } from "@/lib/assets";
import Image from "next/image";

const ContactHero = () => {
  return (
    <section className="relative flex overflow-hidden bg-fill-neutral pt-32 pb-20 md:pb-24 lg:min-h-112 lg:items-center lg:pt-24 lg:pb-0 2xl:min-h-133">
      {/* The artwork carries the support agents on its right side. */}
      <Image
        src={assetUrl("/assets/images/contact-page-banner.png")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-left sm:object-top lg:object-center"
      />
      <Container className="relative">
        <div className="sm:max-w-xs md:max-w-sm lg:max-w-xl lg:pb-5">
          <h1 className="mb-2.5 font-manrope text-xl leading-7 font-extrabold tracking-tight text-foreground sm:text-2xl md:pr-6 md:text-3xl md:leading-snug lg:pr-36 lg:text-4xl">
            Do you need support? Our team is ready to help
          </h1>
          <p className="text-base leading-7 text-muted-foreground lg:pr-28 lg:leading-8 xl:text-lg xl:leading-9">
            We are passionate about building carefully thought out products
            that will improve your design workflow.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default ContactHero;
