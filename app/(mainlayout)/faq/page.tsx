import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Container from "@/components/mainlayout/layout/Container";
import PageHero from "@/components/mainlayout/layout/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Borobazer",
};

const faqs = [
  {
    question: "How to contact with Customer Service?",
    answer:
      "Our customer service team is available every day from 9am to 9pm. Reach us through the Contact Us page, email support@borobazar.com or call the number listed there, and we will get back to you as soon as possible.",
  },
  {
    question: "App installation failed, how to update system information?",
    answer:
      "Make sure your phone runs the latest version of iOS or Android and has enough free storage. Update the system from your phone's settings, restart the device and then install BoroBazar again from the App Store or Google Play.",
  },
  {
    question: "Website response taking time, how to improve?",
    answer:
      "Slow pages are usually caused by the network or an outdated browser cache. Check your internet connection, clear the browser cache and reload the page. If it is still slow, let our support team know which page is affected.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Select Sign In at the top of the page and choose Create Account. Enter your name, email address and a password, then confirm your email to start shopping and tracking your orders.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently Ask Question"
        breadcrumb={[{ label: "FAQ" }]}
      />
      <Container className="py-12 md:py-16 lg:py-20 xl:py-24">
        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-2xl"
        >
          {faqs.map((faq) => (
            <div key={faq.question} className="mb-4 rounded-md px-5 py-2 shadow-sm last:mb-0">
              <AccordionItem value={faq.question}>
                <AccordionTrigger>
                  <span className="text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </Container>
      <DownloadApp />
    </>
  );
}
