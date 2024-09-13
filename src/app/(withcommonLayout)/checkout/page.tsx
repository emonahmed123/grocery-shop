
import CheckoutProductTable from "@/components/chaeakout/CheckoutProductTable";
import PaymentDetails from "@/components/chaeakout/PaymentDetails ";
import React from "react";
const CheckoutPage = () => {
    return (
        <div className="max-w-Container grid grid-cols-2 gap-5 mt-8 px-5 md:px-0 py-[90px] mx-auto">
            <CheckoutProductTable />
            <PaymentDetails />
        </div>
    );
};

export default CheckoutPage;