"use client";

import AddressStep from "@/components/mainlayout/checkout/AddressStep";
import ContactNumberStep from "@/components/mainlayout/checkout/ContactNumberStep";
import InstructionsStep from "@/components/mainlayout/checkout/InstructionsStep";
import PaymentStep from "@/components/mainlayout/checkout/PaymentStep";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const steps = [
  { value: "address", title: "Delivery Address", content: <AddressStep /> },
  { value: "contact", title: "Contact Number", content: <ContactNumberStep /> },
  { value: "payment", title: "Payment Option", content: <PaymentStep /> },
  {
    value: "instructions",
    title: "Delivery Instructions (optional)",
    content: <InstructionsStep />,
  },
];

const CheckoutSteps = () => {
  const [openStep, setOpenStep] = useState(steps[0].value);

  return (
    <div className="overflow-hidden rounded-md border">
      <Accordion
        type="single"
        collapsible
        value={openStep}
        onValueChange={setOpenStep}
      >
        {steps.map((step, index) => {
          const nextStep = steps[index + 1];

          return (
            // Collapsed steps sit on a tinted background; the open one is white.
            <div
              key={step.value}
              className="bg-fill-thumbnail/60 not-last:border-b has-data-[state=open]:bg-transparent"
            >
              <AccordionItem value={step.value}>
                <AccordionTrigger className="items-center [&_[data-slot=accordion-trigger-icon]]:hidden">
                  <span className="flex items-center gap-3 px-4 pt-2 pb-4 sm:px-8 sm:py-5.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-brand font-semibold text-brand">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {step.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-5 pb-6 sm:px-9 lg:pl-20">
                    <div className="mb-6">{step.content}</div>
                    {nextStep && (
                      <div className="flex justify-end">
                        <Button
                          variant="brand"
                          size="lg"
                          onClick={() => setOpenStep(nextStep.value)}
                        >
                          Next Steps
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CheckoutSteps;
