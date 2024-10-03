/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/lib/AuthProviders";
import { TGroceryItem } from "@/Types";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const UpdateModel = ({
  product,
  setProducts,
}: {
  product: TGroceryItem;
  setProducts: any;
}) => {
  const { token } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //   submit handler
  const onSubmit = async (data: any) => {
    const { isFlashSale, price, rating, ...rest } = data;

    const updateData = {
      ...rest,
      price: Number(price),
    };
    const res = await fetch(
      `https://grocery-store-server-orpin.vercel.app/api/product/${product._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );
    const result = await res.json();

    if (result.success) {
      setProducts((prevProducts: any) =>
        prevProducts.map((prod: TGroceryItem) =>
          prod._id === product._id ? { ...prod, ...updateData } : prod
        )
      );
      Swal.fire({
        title: "Product updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      onOpenChange();
    } else {
      Swal.fire({
        title: "Some thing was wrong",
        text: `${result.message}`,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="secondary"
        size="sm"
        variant="shadow"
        className="text-white"
      >
        Edit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  You can Change Only price
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Price"
                      placeholder="Enter your password"
                      type="number"
                      variant="bordered"
                      defaultValue={product?.price.toString()}
                      {...register("price", { required: true })}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">Price is required</p>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary">
                    Update
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModel;
