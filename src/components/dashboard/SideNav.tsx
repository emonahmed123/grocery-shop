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
  FaSignOutAlt,
} from "react-icons/fa";
import { FaDatabase, FaUser } from "react-icons/fa6";

const SideNav = () => {
  const { user, handleLogout } = useAuth();

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

    {
      icon: <FaUser />,
      title: "My Profile",
      url: "/dashboard/myprofile",
      role: ["user", "admin"],
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <ul className="bg-[#1C2434] relative py-2 px-1 md:px-3 space-y-5 w-[50px]  md:w-[70px] lg:w-[180px] xl:w-[200px] min-h-screen  h-full ">
      <p className="text-gray-500 font-bold text-[14px] mb-5">Menu</p>
      {user &&
        navItems
          .filter((item) =>
            Array.isArray(item.role)
              ? item.role.includes(user.role)
              : item.role === user.role
          )
          .map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className={`${
                  isActive(item.url) ? "bg-graydark " : ""
                } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark `}
              >
                <span className="text-white">{item.icon}</span>
                <span className="hidden lg:block">{item.title}</span>
              </Link>
            </li>
          ))}

      <ul className="absolute bottom-20">
        <li className="relative top-[90%]">
          <button
            onClick={handleLogout}
            className="text-bodydark1 flex gap-1 px-4 py-2  items-center font-medium"
          >
            <FaSignOutAlt />
            <span className="hidden lg:block">Logout</span>
          </button>
        </li>
      </ul>
    </ul>
  );
};

export default SideNav;
