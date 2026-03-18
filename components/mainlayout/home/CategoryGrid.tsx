import categoriesJson from "@/public/data/categories.json";
import type { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";

const IMAGE_BASE_URL = "https://borobazar.vercel.app";

const CategoryGrid = () => {
  const categories: Category[] = categoriesJson;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 md:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#11263C] md:text-4xl">
          What food you love to order
        </h2>
        <p className="mt-3 text-base text-slate-600 md:text-lg">
          Here order your favorite foods from different categories
        </p>
      </header>

      <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/product`}
            className="group block w-full shrink-0 px-2 text-center"
          >
            <div className="  mx-auto  mb-3.5 flex h-[140px] w-[140px] max-h-[178px] max-w-[178px] items-center overflow-hidden rounded-full bg-[#f3f6fa] xl:mb-4">
              <div className="flex h-full w-full shrink-0 -translate-x-full scale-50 transform-gpu items-center justify-center transition-all duration-700 group-hover:translate-x-0 group-hover:scale-100">
                <Image
                  src={`${IMAGE_BASE_URL}${category.image.thumbnail}`}
                  alt={category.name}
                  width={178}
                  height={178}
                  className="aspect-square h-full w-full rounded-full object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div className="flex h-full w-full shrink-0 -translate-x-full scale-100 transform-gpu items-center justify-center transition-all duration-700 group-hover:translate-x-0 group-hover:scale-50">
                <Image
                  src={`${IMAGE_BASE_URL}${category.image.thumbnail}`}
                  alt={category.name}
                  width={178}
                  height={178}
                  className="aspect-square h-full w-full rounded-full object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>{" "}
            <h3 className="truncate text-sm   capitalize text-[#11263C] sm:text-[15px] lg:text-base">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
