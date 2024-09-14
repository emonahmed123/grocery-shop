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
            title: "Products",
            url: "/dashboard/products",
            role: "admin",
        },
        {
            title: "Add Product",
            url: "/dashboard/products/add-product",
            role: "admin",
        },
        {
            title: "Orders",
            url: "/dashboard/orders",
            role: "admin",
        },
        {
            title: "My Orders",
            url: "/dashboard/myorder",
            role: "user",
        },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <ul className="bg-primary py-2 px-1 md:px-5 space-y-5  w-[80px] md:w-[200px] min-h-screen ">
            {user &&
                navItems
                    .filter((item) => item.role === user.role)
                    .map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.url}
                                className={`${isActive(item.url)
                                    ? "text-white border-b-1 border-white font-medium text-[14px]"
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