import { Providers } from "@/lib/provider";
import ReduxtProvidor from "@/lib/ReduxtProvidor";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
const josefin = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home",
  description: "BoroBazer grocery-store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${josefin.className}`}>
        <ReduxtProvidor>
          <Providers>{children}</Providers>
        </ReduxtProvidor>
      </body>
    </html>
  );
}
