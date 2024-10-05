"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthProviders";
import React from "react";
import Link from "next/link";
import {
  FaFileMedicalAlt,
  FaPlus,
  FaPray,
  FaShoppingCart,
} from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";

const SideNav = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      icon: <FaDatabase />,
      title: "Dashboard",
      url: "/dashboard/overview",
      role: "admin",
    },
    {
      icon: <FaPray />,
      title: "Products",
      url: "/dashboard/allproduct",
      role: "admin",
    },
    {
      icon: <FaPlus />,
      title: "Add Product",
      url: "/dashboard/addproduct",
      role: "admin",
    },
    {
      icon: <FaFileMedicalAlt />,
      title: "All Orders",
      url: "/dashboard/allorder",
      role: "admin",
    },
    {
      icon: <FaDatabase />,
      title: "Dashboard",
      url: "/dashboard/useroverview",
      role: "user",
    },

    {
      icon: <FaShoppingCart />,
      title: "My Orders",
      url: "/dashboard/myorder",
      role: "user",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <ul className="bg-[#1C2434] py-2 px-1 md:px-5 space-y-5  w-[80px] md:w-[100px] lg:w-[200px] min-h-screen  h-full">
      <p className="text-gray-500 font-bold text-[14px] mb-5">Menu</p>
      {user &&
        navItems
          .filter((item) => item.role === user.role)
          .map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className={`${
                  isActive(item.url) ? "bg-graydark dark:bg-meta-4" : ""
                } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
    </ul>
  );
};

export default SideNav;
