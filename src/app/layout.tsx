import { Providers } from "@/lib/provider";
import ReduxtProvidor from "@/lib/ReduxtProvidor";
import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "400", "500", "600", "700", "800"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EAS Home",
  description: "EAS grocery-store",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  // console.log("auth", auth);
  return (
    <html lang="en">
      <body
        className={`  ${geistSans.variable} ${geistMono.variable} antialiased  ${poppins.variable}  ${manrope.variable}`}
      >
        <ReduxtProvidor>
          <Providers>
            <div>{auth}</div>
            {children}

            {/* <div id="modal-root" /> */}
          </Providers>
        </ReduxtProvidor>
      </body>
    </html>
  );
}
