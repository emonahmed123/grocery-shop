/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import { useAppSelector } from "@/redux/hook";
import Image from "next/image";


const CheckoutProductTable = () => {
    const { products } = useAppSelector((state) => state.cart);
    const columns = [
        {
            key: "items",
            label: "Items",
        },

        {
            key: "price",
            label: "Price",
        },
        {
            key: "quantity",
            label: "Quantity",
        },
    ];

    return (
        <Table>
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {products.map((product: any) => (
                    <TableRow key={product._id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <div className="h-[70px] w-[60px]">
                                    <Image
                                        src={product.image}
                                        alt="product_image"
                                        width={60}
                                        height={70}
                                        className="object-fill h-full w-full rounded-md"
                                    />
                                </div>
                                <p>{product.name}</p>
                            </div>
                        </TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.quantity}</TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default CheckoutProductTable;