/* eslint-disable @typescript-eslint/no-explicit-any */
import AddButtonCart from '@/components/ui/AddButtonCart';

import Image from 'next/image';
import React from 'react';

const ProductDetails = async ({ params }: any) => {

    const res = await fetch(`http://localhost:5000/data/${params.productId}`, {

    })

    const product = await res.json()
    return (


        <section className="py-[90px] md:py-[60px]">

            <div className='max-w-Container mx-auto px-5 xl:px-0'>
                <div className='flex justify-between flex-cols lg:flex-row gap-x-6 items-center'>


                    <div className='max-w-[600px]'>
                        <Image src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVNN58XFDLxdqtwwWRSE924NjtuSryXFGxjg&s'} width={600} height={600} alt='hello'></Image>
                    </div>


                    <div className='max-w-[600px]'>

                        <h1 className='text-3xl  md:text-6xl mb-3'>{product?.name} </h1>

                        <p className='text-xl mb-3'>${product?.price}</p>
                        <p className='text-xl mb-3'> {product?.description}</p>

                        <AddButtonCart product={product} />


                    </div>
                </div>

            </div>


        </section>
    );
};

export default ProductDetails;