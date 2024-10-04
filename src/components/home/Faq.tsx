"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";

const Faq = () => {
  const defaultContent = [
    {
      title: "How will my order be delivered to me ?",
      des: "Your order will be delivered via a trusted courier service. You'll receive tracking details to monitor the delivery progress. Expect it to arrive within the estimated timeframe provided at checkout.",
    },
    {
      title: "How do I check the status of my order ?",
      des: "You can check your order status by using the tracking number provided via email. Simply enter it on the courier's website to see the latest updates.",
    },
    {
      title: "What are the shipping charges ?",
      des: "Shipping charges vary based on your location, the size and weight of the order, and the selected shipping method. The total cost will be calculated and displayed at checkout before you complete your purchase",
    },
    {
      title: "Can I cancel my order ?",
      des: "If you need to cancel your order, please contact us as soon as possible. We will do our best to accommodate your request, but please note that some items may have already been processed or shipped.",
    },
  ];
  const itemClasses = {
    title: "font-normal text-[16px] text-black font-semibold  ",
    content: " px-2 border  py-5 text-[14px] leading-[24px]",
    trigger:
      " px-2 bg-[#FAD400]  mt-5 py-2 h-14 flex items-center text-gray-500",
    indicator: "text-black",
  };
  return (
    <section className="  md:py-[80px] py-[40px] font-poppe">
      <div className="max-w-[1170px] mx-auto px-5 xl:px-0 font-poppe">
        <h1 className="text-[30px] leading-[40px] md:text-[50px] md:leading-[60px] mb-10 text-center font-semibold">
          Frequently Asked Questions
        </h1>

        <Accordion
          showDivider={false}
          itemClasses={itemClasses}
          className="bg-white"
        >
          {defaultContent.map((item, index) => (
            <AccordionItem
              key={index}
              aria-label="Accordion 1"
              title={item.title}
            >
              {item.des}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
