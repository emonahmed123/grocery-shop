"use client";

import { CreditCard } from "lucide-react";

import ChoiceCard from "@/components/mainlayout/checkout/ChoiceCard";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { type PaymentMethod, useCheckoutActions, usePaymentMethod } from "@/store/checkout.store";

const paymentMethods = [
  {
    value: "cash-on-delivery",
    title: "Cash on Delivery",
    description: "Pay with cash when your order arrives.",
  },
  {
    value: "card",
    title: "Credit / Debit Card",
    description: "Pay now with your Visa or Mastercard.",
  },
] satisfies { value: PaymentMethod; title: string; description: string }[];

const PaymentStep = () => {
  const paymentMethod = usePaymentMethod();
  const { selectPaymentMethod } = useCheckoutActions();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">Payment Method</h3>
        <div className="grid gap-4 text-sm md:grid-cols-2 md:gap-5">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => selectPaymentMethod(value as PaymentMethod)}
            aria-label="Payment method"
            className="contents"
          >
            {paymentMethods.map((method) => (
              <ChoiceCard
                key={method.value}
                id={`payment-${method.value}`}
                value={method.value}
                title={method.title}
                description={method.description}
              />
            ))}
          </RadioGroup>
        </div>
      </section>

      {paymentMethod === "card" && (
        <div className="flex w-full flex-col gap-4 xl:max-w-125">
          <p className="text-sm text-muted-foreground">Enter card info</p>
          <InputGroup className="h-12">
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Card number"
              aria-label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
            />
          </InputGroup>
          <div className="grid grid-cols-2 gap-4">
            <Input className="h-12" placeholder="MM / YY" aria-label="Expiry date" autoComplete="cc-exp" />
            <Input
              className="h-12"
              placeholder="CVC"
              aria-label="Security code"
              inputMode="numeric"
              autoComplete="cc-csc"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
