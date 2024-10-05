"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthProviders";
import React from "react";
import Link from "next/link";

const SideNav = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      role: "admin",
    },
    {
      title: "Products",
      url: "/dashboard/allproduct",
      role: "admin",
    },
    {
      title: "Add Product",
      url: "/dashboard/addproduct",
      role: "admin",
    },
    {
      title: "Orders",
      url: "/dashboard/allorder",
      role: "admin",
    },
    {
      title: "Dashboard",
      url: "/dashboard/useroverview",
      role: "user",
    },

    {
      title: "My Orders",
      url: "/dashboard/myorder",
      role: "user",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <ul className="bg-primary py-2 px-1 md:px-5 space-y-5  w-[80px] md:w-[100px] lg:w-[200px] min-h-screen  h-full">
      {user &&
        navItems
          .filter((item) => item.role === user.role)
          .map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className={`${
                  isActive(item.url)
                    ? "text-white border-b-1 pb-1 border-white font-medium text-[14px]"
                    : "foreground"
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
    </ul>
  );
};

export default SideNav;
