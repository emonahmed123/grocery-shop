import CheckoutProductTable from "@/components/chaeakout/CheckoutProductTable";
import PaymentDetails from "@/components/chaeakout/PaymentDetails ";
import React from "react";
const CheckoutPage = () => {
  return (
    <div className="max-w-Container grid lg:grid-cols-2 grid-cols-1 gap-5  px-[30px] xl:px-0 py-[50px] md:py-[90px] mx-auto">
      <CheckoutProductTable />
      <PaymentDetails />
    </div>
  );
};

export default CheckoutPage;
