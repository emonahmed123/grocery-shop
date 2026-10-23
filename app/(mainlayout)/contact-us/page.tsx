import ContactHero from "@/components/mainlayout/contact/ContactHero";
import ContactInfo from "@/components/mainlayout/contact/ContactInfo";
import ContactMap from "@/components/mainlayout/contact/ContactMap";
import ContactSupport from "@/components/mainlayout/contact/ContactSupport";
import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Borobazer",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSupport />
      <ContactInfo />
      <ContactMap />
      <DownloadApp />
    </>
  );
}
