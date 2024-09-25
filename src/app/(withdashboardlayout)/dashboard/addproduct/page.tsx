/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useAuth } from "@/lib/AuthProviders";

import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AddProductPage = () => {
    const { token } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();


    //   handle
    const onSubmit = async (data: any) => {
        try {
            const { name, description, price, image, category } =
                data;

            const Nubers = +price
            //  handle sending product data to server
            const productData = {
                name,
                description,
                price: Nubers,
                image,
                category

            };
            const response = await fetch(
                `https://grocery-store-server-orpin.vercel.app/api/product`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(productData),
                }
            );
            const result = await response.json();

            console.log(result)
            if (result.success) {
                Swal.fire({
                    title: "Product Create successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
                reset();
                console.log(result);
            } else {
                Swal.fire({
                    title: "Product  Not Create ",
                    text: "Contact with Developer",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {

            Swal.fire({
                title: " Big Probleme",
                text: "Contact with Developer",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            })
        }
    };
    console.log(errors);
    return (
        <div className="mt-10">
            <h1 className="text-3xl font-semibold text-center mb-5 pb-2 border-b-2 bor">
                Add Product
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div className="grid grid-cols-2 gap-3">
                    {/* product name */}
                    <div>
                        <Input
                            type="text"
                            label="Product Name"
                            {...register("name", { required: true })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">Name is required</p>
                        )}
                    </div>

                    {/* product name */}
                    <div>
                        <Input
                            type="url"
                            label="Image"
                            {...register("image", { required: true })}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm">image is required</p>
                        )}
                    </div>
                    <div>
                        <Input
                            type="number"
                            label="Product Price"
                            {...register("price", { required: true })}
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm">price is required</p>
                        )}
                    </div>


                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                        <div className=" w-full">
                            <Select
                                label="Product Categories"
                                placeholder="Select Category"
                                {...register("category", { required: true })}
                            >
                                <SelectItem key="1">Meat</SelectItem>
                                <SelectItem key="2">Vegetables</SelectItem>
                                <SelectItem key="3">Fruits</SelectItem>
                                <SelectItem key="4">Bakery</SelectItem>
                                <SelectItem key="5">Dairy-Free</SelectItem>
                            </Select>
                            {errors.category && (
                                <p className="text-red-500 text-sm">Category is required</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Textarea
                            label="Description"
                            placeholder="Enter your description"
                            className="w-full"
                            {...register("description", { required: true })}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">Description is required</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <Button
                        type="submit"
                        variant="shadow"
                        color="primary"
                        className="text-black"
                    >
                        Add Product
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;