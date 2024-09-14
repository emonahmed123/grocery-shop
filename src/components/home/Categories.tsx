import React from "react";
import { Button, Card, Image } from "@nextui-org/react";
import Link from "next/link";
// import RightArrow from "../ui/RightArrow";

const Categories = () => {
    const data = [
        {
            id: 1,
            name: "Category 1",
            image:
                "https://minimalistbaker.com/wp-content/uploads/2017/09/DELICIOUS-Oil-Free-Roasted-Vegetables-30-minutes-simple-method-SO-healthy-and-satisfying-vegan-vegetables-plantbased-brocolli-oilfree-potato-glutenfree.jpg",
        },
        {
            id: 2,
            name: "Category 2",
            image:
                "https://images.squarespace-cdn.com/content/v1/59f0e6beace8641044d76e9c/1669587646206-6Z76MY4X3GBFKIUQZJ4R/Social+Meat.jpeg?format=500w",
        },
        {
            id: 3,
            name: "Category 3",
            image:
                "https://c8.alamy.com/comp/2C75YJ4/background-food-fruits-and-vegetables-collection-fruit-vegetable-portrait-format-healthy-eating-diet-apples-oranges-tomatoes-backgrounds-2C75YJ4.jpg",
        },
        {
            id: 4,
            name: "Category 4",
            image:
                "https://www.healthifyme.com/blog/wp-content/uploads/2023/06/shutterstock_2239704493-1.jpg",
        },
    ];

    return (
        <section className="py-[75px]">
            <div className=" max-w-Container mx-auto px-5 xl:px-0">
                <div className=" text-center mb-5 ">
                    <h2 className="text-3xl font-semibold gradient mb-3">Our Categories</h2>
                    <p className="text-foreground w-1/2 mx-auto">
                        Discover our top categories, featuring everything from cozy clothing
                        to essential baby gear.we haveve curated the best products to keep your
                        little one happy and healthy.
                    </p>
                </div>
                {/* cards */}
                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5 mb-5">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className={`${(index + 1) % 2 === 1 ? "row-span-2" : ""}`}
                        >
                            <Card
                                isPressable
                                radius="lg"
                                className={`${(index + 1) % 2 === 1 ? "h-[515px]" : "h-[240px]"
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
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center">
                    <Button
                        as={Link}
                        href="/product"
                        color="primary"
                        variant="bordered"
                        className="shadow-2xl shadow-primary hover:bg-primary hover:text-black transition-all duration-500"
                    // endContent={<RightArrow />}
                    >
                        View All
                    </Button>
                </div>
            </div>


        </section>
    );
};

export default Categories;