import Banner from '@/components/home/Banner';
import Categories from '@/components/home/Categories';
import React from 'react';
import PopularProducts from '@/components/home/PopularProducts'
const Home = async () => {
    const res = await fetch('http://localhost:5000/data', {
        // cache: 'no-store'
    })

    const products = await res.json()

    return (
        <div  >
            <Banner></Banner>
            <Categories></Categories>

            <PopularProducts products={products}></PopularProducts>
        </div>
    );
};

export default Home;