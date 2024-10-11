import React from "react";
import { Card, Image } from "@nextui-org/react";
import Link from "next/link";
// import RightArrow from "../ui/RightArrow";

const Categories = () => {
  const data = [
    {
      id: 1,
      name: "Category 1",
      image:
        "https://minimalistbaker.com/wp-content/uploads/2017/09/DELICIOUS-Oil-Free-Roasted-Vegetables-30-minutes-simple-method-SO-healthy-and-satisfying-vegan-vegetables-plantbased-brocolli-oilfree-potato-glutenfree.jpg",
      link: "/cateagory/categroy?category=Vegetables",
    },
    {
      id: 2,
      name: "Category 2",
      image:
        "https://images.squarespace-cdn.com/content/v1/59f0e6beace8641044d76e9c/1669587646206-6Z76MY4X3GBFKIUQZJ4R/Social+Meat.jpeg?format=500w",
      link: "/cateagory/categroy?category=Meat",
    },
    {
      id: 3,
      name: "Category 3",
      image:
        "https://c8.alamy.com/comp/2C75YJ4/background-food-fruits-and-vegetables-collection-fruit-vegetable-portrait-format-healthy-eating-diet-apples-oranges-tomatoes-backgrounds-2C75YJ4.jpg",
      link: "/cateagory/categroy?category=Fruits",
    },
    {
      id: 4,
      name: "Category 4",
      image:
        "https://www.healthifyme.com/blog/wp-content/uploads/2023/06/shutterstock_2239704493-1.jpg",
      link: "/cateagory/categroy?category=Fish",
    },
  ];

  return (
    <section className="py-[50px] md:py-[75px]">
      <div className=" max-w-[1170px] mx-auto px-5 xl:px-0">
        <div className=" text-center mb-5 ">
          <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-bold font-manrope 3xl:text-[25px] 3xl:leading-9 mb-3">
            Choose categories from below
          </h2>
          <p className="text-base md:text-[17px] xl:text-lg leading-7 md:leading-8 xl:leading-[1.92em] xl:px-16 text-brand-dark text-opacity-80 2xl:px-32">
            Here order your favorite foods from different categories
          </p>
        </div>
        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5 ">
          {data.map((item, index) => (
            <div
              key={index}
              className={`${(index + 1) % 2 === 1 ? "row-span-2" : ""}`}
            >
              <Link href={item?.link || "/"}>
                <Card
                  isPressable
                  className={`${
                    (index + 1) % 2 === 1
                      ? "md:h-[499px] lg:h-[440px] xl:h-[515px]"
                      : " md:h-[240px] lg:h-[210px] xl:h-[240px]"
                  } border-none hover:drop-shadow-2xl duration-500 transition-all`}
                >
                  <div>
                    <Image
                      alt={item.name}
                      className="object-cover h-full w-full"
                      src={item.image}
                    />
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
