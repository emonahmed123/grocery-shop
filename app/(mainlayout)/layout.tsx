import Header from "@/components/mainlayout/layout/Header";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
      <footer>
        <p>Main Layout Footer</p>
      </footer>
    </main>
  );
}
