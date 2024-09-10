import { Button } from '@nextui-org/react';
import React from 'react';

const Banner = () => {


    return (
        <div className=' h-screen  bg-[url("https://i.ibb.co/bmFLW7G/banner.jpg")] bg-cover bg-no-repeat'>


            <div className='w-full bg-[#ffffffc2] h-full  flex justify-center items-center'>

                <div className='max-w-[800px] mx-auto  px-5 xl:px-0'>
                    <h1 className=' text-[30px] leading-[40px]  md:text-[60px] md:leading-[70px] font-blod text-center mb-3 md:mb-6'>
                        Your Local Marketplace for Fresh and Sustainable Good</h1>

                    <p className='text-[16px] leading-[27px] text-center  mb-3 md:mb-6'>At Growcery, we connect you with local farmers, artisans, and small businesses to bring fresh, organic, and sustainable products straight to your door. From farm-fresh vegetables to handmade goods, our marketplace supports local producers while providing you with the healthiest and freshest options available. Shop with us and make a positive impact on your community and the planet!</p>
                    <div className='flex justify-center items-center'>

                        <Button radius="full" size='lg' variant="shadow" className="bg-gradient-to-tr from-primary to-yellow-500 text-white shadow-lg">Buy Now</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Banner;