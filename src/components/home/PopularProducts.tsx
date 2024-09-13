import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import ProductCard from '../ui/ProductCard';
import { TGroceryItem } from '@/Types';

const PopularProducts = ({ products }: { products: TGroceryItem[] }) => {





  return (
    <section className=" py-[50px] md:py-[80px]">
      <div className='max-w-Container mx-auto px-5 xl:px-0'>
        <div className="flex flex-col md:flex-row  items-start gap-y-4  md:items-center justify-center mb-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold gradient">
              Most Popular Products
            </h2>
            <p className="text-foreground w-full md:w-1/2">
              Discover our top categories, featuring everything from fresh produce to pantry essentials. We’ve curated the best products to keep your meals delicious and your kitchen stocked with quality ingredients.
            </p>
          </div>
          <Button
            as={Link}
            href="/products"
            color="primary"
            variant="bordered"
            radius="lg"
            className="shadow-2xl shadow-primary hover:bg-primary hover:text-black transition-all duration-500"
          // endContent={<RightArrow />}
          >
            View All
          </Button>
        </div>
        <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-3 gap-5">
          {
            products?.slice(0, 4).map((item, i) => <ProductCard item={item} key={i}></ProductCard>)
          }

        </div>
      </div>
    </section>
  );
};

export default PopularProducts;