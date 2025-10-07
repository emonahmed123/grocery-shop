/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useAuth } from "@/lib/AuthProviders";

import { Button } from "@nextui-org/react";

import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
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
      const { name, description, price, category } = data;
      console.log(category);
      const Nubers = +price;
      let imageUrl = "";
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        // const img_hosting_token = process.env.IMAGE_UPLOAD_TOKEN;
        // console.log(img_hosting_token);
        const imgBBResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=532c300e73413a775eeaee5314c89018`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imgBBResponse.ok) {
          console.log(imgBBResponse);
          Swal.fire({
            title: "Image upload failed",
            text: "Please try again",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        const imgBBData = await imgBBResponse.json();
        imageUrl = imgBBData.data.url; // Get the image URL from ImgBB
      }

      //  handle sending product data to server
      const productData = {
        name,
        description,
        price: Nubers,
        image: imageUrl,
        category,
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

      // console.log(result);
      if (result.success) {
        Swal.fire({
          title: "Product Create successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        console.log(result);
      } else {
        Swal.fire({
          title: "Product  Not Create ",
          text: "Contact with Developer",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: " Big Probleme",
        text: "Contact with Developer",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  };
  // console.log(errors);
  return (
    <div className="font-poppins py-10 mx-w-[1440px] mx-auto px-2">
      <h1 className="text-3xl font-semibold text-center mb-10  border-gray-300">
        Add <span className="text-secondary.foreground">Product</span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-6">
          {/* product name */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300 ">
              Product Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Product name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            {errors.name && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>

          {/* product name */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300 ">
              Image
            </label>
            <input
              {...register("image", { required: true })}
              type="file"
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              placeholder="Upload Image"
            />

            {errors.image && (
              <p className="text-red-500 text-sm">image is required</p>
            )}
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300 ">
              Product Price
            </label>
            <input
              {...register("price", { required: true })}
              type="number"
              placeholder="Product name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            {errors.price && (
              <p className="text-red-500 text-sm">Price is required</p>
            )}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className=" w-full">
              <label className="mb-3 block text-sm font-medium text-gray-300 ">
                Product Categories
              </label>
              <select
                className="w-full bg-whitew-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register("category", { required: true })}
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Meat">Meat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Bakery">Bakery</option>
                <option value="Dairy-Free">Dairy-Free</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">Category is required</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={6}
              placeholder="Active textarea"
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            ></textarea>

            {errors.description && (
              <p className="text-red-500 text-sm">Description is required</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Button
            type="submit"
            variant="shadow"
            size="lg"
            color="primary"
            className="text-white"
          >
            Add Product <FaPlus size={15} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
