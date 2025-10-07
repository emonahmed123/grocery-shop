import Eeaer from "@/components/about/Eeaer";
import CheckoutProductTable from "@/components/chaeakout/CheckoutProductTable";
import PaymentDetails from "@/components/chaeakout/PaymentDetails ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "BoroBazer grocery-store",
};
const CheckoutPage = () => {
  return (
    <>
      <div className="max-w-[1170px] grid lg:grid-cols-2 grid-cols-1 gap-8  px-[20px] xl:px-0 py-[50px] md:py-[90px] mx-auto">
        <CheckoutProductTable />
        <PaymentDetails />
      </div>
      <Eeaer />
    </>
  );
};

export default CheckoutPage;
