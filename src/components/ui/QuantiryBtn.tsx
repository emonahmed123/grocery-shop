/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
    selectProductQuantity,
    updateQuantity,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

import { Button } from "@nextui-org/button";
import Swal from "sweetalert2";

const QuantityBtn = ({ productId }: { productId: string }) => {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector((state) => state.cart);

    const quantity = useAppSelector((state) =>
        selectProductQuantity(state, productId)
    );

    const handleUpdateQuantity = (type: string, _id: string) => {
        const isProductExistInList = products.find(
            (product: any) => product._id === productId
        );
        const payload = { type, _id };
        if (isProductExistInList) {
            dispatch(updateQuantity(payload));

            Swal.fire({
                text: "quantity updated of your selected product",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            Swal.fire({
                text: "first add the product to your bucket!",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };
    return (
        <div className="flex items-center  p-1 border rounded-full">
            <Button
                onClick={() => handleUpdateQuantity("decrement", productId)}
                className="bg-transparent  text-xl"
            >
                -
            </Button>
            <p>{quantity}</p>
            <Button
                onClick={() => handleUpdateQuantity("increment", productId)}
                className="bg-transparent text-xl"
            >
                +
            </Button>
        </div>
    );
};

export default QuantityBtn;
