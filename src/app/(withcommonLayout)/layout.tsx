import Footer from "@/components/Shared/Footer";
import NavbarMain from "@/components/Shared/NavbarMain";

import React from "react";

const Commonlayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavbarMain />

      <div>{children}</div>

      <Footer></Footer>
    </>
  );
};

export default Commonlayout;
