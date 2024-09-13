"use client";


import { useAppSelector } from "@/redux/hook";
// import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Button, Checkbox, Divider } from "@nextui-org/react";


const PaymentDetails = () => {
    //   const dispatch = useAppDispatch();

    //   const { deliveryCharge, selectedItems, total } = useAppSelector(
    //     (state) => state.cart
    //   );


    //   const totalAmount = Number(total.toFixed(2));

    const { totalPrice, selectedItems, grandTotal, deliveryCharge } = useAppSelector((store) => store.cart)


    //   const handleCheckout = async () => {
    //     try {
    //       console.log(token, "url line 14");
    //       const order = {
    //         userId: user?.userId,
    //         username: user?.username,
    //         totalAmount,
    //         quantity: Number(selectedItems),
    //       };
    //       const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_SERVER}/order`, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`, // Add the token here
    //         },
    //         body: JSON.stringify(order),
    //       });
    //       const data = await res.json();
    //       if (data?.success) {
    //         toast.success("order  placed successfully", {
    //           className: "bg-green-500 text-white",
    //         });
    //         dispatch(clearCart());
    //       } else {
    //         toast.error(data?.message, {
    //           className: "bg-green-500 text-white",
    //         });
    //       }
    //     } catch (err) {
    //       toast.error("Something went wrong try Again!", {
    //         className: "bg-green-500 text-white",
    //       });
    //     }
    //   };
    return (
        <div className="space-y-5">
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
            <Button
                // onClick={handleCheckout}
                // isDisabled={!user}
                color="primary"
                variant="shadow"
                className="w-full text-black"
            >
                place an order
            </Button>
            {/* {!user && (
        <p className="text-sm text-red-500">
          You need to Login to proceed the checkout process
        </p>
      )} */}
        </div>
    );
};

export default PaymentDetails;