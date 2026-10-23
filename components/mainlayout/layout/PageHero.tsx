import PageBreadcrumb, {
  type Crumb,
} from "@/components/mainlayout/layout/PageBreadcrumb";
import { assetUrl } from "@/lib/assets";
import Image from "next/image";

type PageHeroProps = {
  title: string;
  breadcrumb: Crumb[];
};

/** Title banner used at the top of content pages such as FAQ and Privacy. */
const PageHero = ({ title, breadcrumb }: PageHeroProps) => {
  return (
    <section className="relative flex min-h-60 items-center justify-center overflow-hidden bg-fill-thumbnail px-4 pt-28 pb-14 md:min-h-72 md:pt-32 lg:min-h-80">
      <Image
        src={assetUrl("/assets/images/page-hero-bg.png")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative flex flex-col items-center gap-3 text-center md:gap-4">
        <h1 className="font-manrope text-2xl font-bold text-foreground md:text-3xl xl:text-4xl">
          {title}
        </h1>
        <PageBreadcrumb items={breadcrumb} />
      </div>
    </section>
  );
};

export default PageHero;
