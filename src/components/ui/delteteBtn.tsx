/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  removeFromCart,
  selectProductQuantity,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Button } from "@nextui-org/react";
import React from "react";

import Swal from "sweetalert2";

const DelteteBtn = ({ deletedId }: { deletedId: string }) => {
  const quantity = useAppSelector((state) =>
    selectProductQuantity(state, deletedId)
  );
  const dispatch = useAppDispatch();

  const handleDelete = (_id: string) => {
    const payload = { _id };
    dispatch(removeFromCart(payload));

    Swal.fire({
      title: `Delete to cart success `,
      text: "Delete to cart success",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      {quantity > 0 ? (
        <Button color="danger" onClick={() => handleDelete(deletedId)}>
          Delete
        </Button>
      ) : null}
    </div>
  );
};

export default DelteteBtn;
