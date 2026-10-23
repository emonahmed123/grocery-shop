"use client";

import ChoiceCard from "@/components/mainlayout/checkout/ChoiceCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { type PaymentMethod, useCheckoutActions, usePaymentMethod } from "@/store/checkout.store";

// The backend has no card gateway yet, so card details are never asked for.
const paymentMethods = [
  {
    value: "cash-on-delivery",
    title: "Cash on Delivery",
    description: "Pay with cash when your order arrives.",
    disabled: false,
  },
  {
    value: "card",
    title: "Credit / Debit Card",
    description: "Online card payment is coming soon.",
    disabled: true,
  },
] satisfies { value: PaymentMethod; title: string; description: string; disabled: boolean }[];

const PaymentStep = () => {
  const paymentMethod = usePaymentMethod();
  const { selectPaymentMethod } = useCheckoutActions();

  return (
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
              disabled={method.disabled}
            />
          ))}
        </RadioGroup>
      </div>
    </section>
  );
};

export default PaymentStep;
