import Footer from "@/components/mainlayout/layout/Footer";
import Header from "@/components/mainlayout/layout/Header";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
