import CheckoutSteps from "@/components/mainlayout/checkout/CheckoutSteps";
import OrderSummary from "@/components/mainlayout/checkout/OrderSummary";
import Container from "@/components/mainlayout/layout/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Borobazer",
};

export default function CheckoutPage() {
  return (
    <Container className="pt-28 pb-10 md:pt-32 2xl:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row xl:gap-8">
        <div className="w-full lg:w-2/3">
          <CheckoutSteps />
        </div>
        <div className="w-full lg:w-1/3">
          <OrderSummary />
        </div>
      </div>
    </Container>
  );
}
