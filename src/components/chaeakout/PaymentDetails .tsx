/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/AuthProviders";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
// import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Button, Checkbox, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

const PaymentDetails = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAuth();

  const router = useRouter();
  const { products, totalPrice, selectedItems, grandTotal, deliveryCharge } =
    useAppSelector((store) => store.cart);
  const productsId = products.map((product: any) => product._id);
  // console.log(productsId)
  // console.log(user?.userId)

  const handleCheckout = async () => {
    try {
      const order = {
        name: user?.name,
        userId: user?.userId,
        totalAmount: grandTotal,
        products: productsId,
        quantity: Number(selectedItems),
      };

      const res = await fetch(
        "https://grocery-store-server-orpin.vercel.app/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token here
          },
          body: JSON.stringify(order),
        }
      );
      const data = await res.json();
      if (data?.success) {
        Swal.fire({
          title: "Order plaece success fully",
          text: "",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/dashboard/myorder");
        dispatch(clearCart());
      } else {
        console.log(data);
        Swal.fire({
          title: `${data.message}`,
          text: "Oder Not create",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Some thing is wrong",
        text: "",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="space-y-5  w-full">
      <p className="text-foreground">
        By placing your order, you agree to our company Privacy policy and
        Conditions of use.
      </p>
      <Divider />

      <h3 className="text-2xl">Order Summary</h3>
      <div className="grid grid-cols-2 justify-between gap-2">
        <p>Total Product Quantity</p>
        <p>{selectedItems}</p>
        <p>Total Proudct Price</p>
        {totalPrice}
        <p>Delivery Charge</p>
        <p>{deliveryCharge}TK</p>
      </div>
      <Divider />
      <div className="grid grid-cols-2 justify-between text-xl">
        <h3>Order Total</h3>
        <p>{grandTotal} TK</p>
      </div>
      <Checkbox isDisabled defaultSelected color="primary">
        Cash On Delivery
      </Checkbox>
      {user && selectedItems ? (
        <Button
          onClick={handleCheckout}
          color="primary"
          variant="shadow"
          className="w-full text-black"
        >
          place an order
        </Button>
      ) : (
        <Button
          onClick={handleCheckout}
          isDisabled
          color="primary"
          variant="shadow"
          className="w-full text-black"
        >
          Place an order
        </Button>
      )}
    </div>
  );
};

export default PaymentDetails;
