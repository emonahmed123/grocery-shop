/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"



import { addToCart } from '@/redux/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TGroceryItem } from '@/Types';
import { Button } from '@nextui-org/react';
import React from 'react';

const AddButtonCart = ({ product }: { product: TGroceryItem }) => {

    console.log(product)
    const count = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()
    const handle = (product: any) => {
        dispatch(addToCart(product))
    }

    console.log(count)
    return (
        <div>

            <Button onClick={(e) => { e.stopPropagation(), handle(product) }}> Add To Cart </Button>


        </div>
    );
};

export default AddButtonCart;