import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { siteOwner } from "@/lib/siteConfig";
import QueryProvider from "@/providers/QueryProvider";
import StoreHydration from "@/providers/StoreHydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Borobazer",
  description: "Bororbazer Ecommerce Platform",
  authors: [{ name: siteOwner.name, url: siteOwner.github }],
  creator: siteOwner.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> so `--font-sans` in :root can resolve them.
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-center" richColors />
        <StoreHydration />
      </body>
    </html>
  );
}
