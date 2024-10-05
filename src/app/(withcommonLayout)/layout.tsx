import Footer from "@/components/Shared/Footer";
import NavbarMain from "@/components/Shared/NavbarMain";
import { authOption } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

import React from "react";

const Commonlayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOption);

  return (
    <>
      <NavbarMain session={session} />

      <div>{children}</div>

      <Footer></Footer>
    </>
  );
};

export default Commonlayout;
