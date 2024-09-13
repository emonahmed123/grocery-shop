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
            url: "/dashboard/my-orders",
            role: "user",
        },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <ul className="bg-background py-2 px-5 space-y-5 h-[500px]">
            {user &&
                navItems
                    .filter((item) => item.role === user.role)
                    .map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.url}
                                className={`${isActive(item.url)
                                        ? "text-primary border-b-3 border-primary font-semibold"
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