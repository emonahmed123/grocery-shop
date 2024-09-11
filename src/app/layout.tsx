import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/provider";
import ReduxtProvidor from "@/lib/ReduxtProvidor";


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

export const metadata: Metadata = {
  title: "EAS Home",
  description: "EAS grocery-store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`  ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxtProvidor>

          <Providers>
            {children}

          </Providers>

        </ReduxtProvidor>
      </body>
    </html>
  );
}
