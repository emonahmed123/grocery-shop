// import Cart from '@/components/ui/Cart';
import Cart from '@/components/ui/Cart';
import OrderSummary from '@/components/ui/OrderSummary';
import React from 'react';

const Cartpage = () => {
    return (
        <div className='max-w-[1170px] mx-auto  py-[90px] flex justify-between items-center'>
            <Cart></Cart>
            <OrderSummary />
        </div>
    );
};

export default Cartpage;