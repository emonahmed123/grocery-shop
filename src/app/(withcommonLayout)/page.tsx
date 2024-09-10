import Banner from '@/components/home/Banner';
import Categories from '@/components/home/Categories';
import React from 'react';
import PopularProducts from '@/components/home/PopularProducts'
const Home = async () => {
    const res = await fetch('https://21d3c6d6-7e2c-4e1d-abbb-f0073560b61d.mock.pstmn.io/cars')

    const products = await res.json()

    return (
        <div className='' >
            <Banner></Banner>
            <Categories></Categories>

            <PopularProducts products={products.data}></PopularProducts>
        </div>
    );
};

export default Home;