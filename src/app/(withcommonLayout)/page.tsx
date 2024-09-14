import Banner from '@/components/home/Banner';
import Categories from '@/components/home/Categories';
import React from 'react';
import PopularProducts from '@/components/home/PopularProducts'
const Home = async () => {
    const res = await fetch('https://grocery-store-server-orpin.vercel.app/api/product', {
        cache: 'no-store'
    })

    const products = await res.json()

    return (
        <div  >
            <Banner></Banner>
            <Categories></Categories>

            <PopularProducts products={products.data}></PopularProducts>
        </div>
    );
};

export default Home;