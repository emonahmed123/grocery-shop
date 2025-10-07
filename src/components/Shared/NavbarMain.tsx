/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useAuth } from "@/lib/AuthProviders";
import { useAppSelector } from "@/redux/hook";
import {
  Badge,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
type userProps = {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
};

const NavbarMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const products = useAppSelector((store) => store.cart.products);
  const pathname = usePathname();
  const { user, token, handleLogout } = useAuth();
  const menuItems = [
    "Home",
    "Categories",
    "About",
    ...(user ? ["Dashboard"] : []),
  ];
  const isActive = (href: string) => pathname === href;

  return (
    <Navbar
      isBordered
      disableAnimation={true}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      className="bg-transparent font-poppe"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* for small device */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Image
            src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
            width={131}
            height={30}
            alt="logo"
          />
        </NavbarBrand>
      </NavbarContent>
      {/* for md device  */}
      <NavbarBrand className="hidden sm:block">
        <Image
          src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
          width={131}
          height={30}
          alt="logo"
        />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color={isActive("/") ? "primary" : "foreground"} href="/">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={isActive("/product")}>
          <Link
            color={isActive("/product") ? "primary" : "foreground"}
            href="/product"
          >
            Product
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive("/about")}>
          <Link
            color={isActive("/about") ? "primary" : "foreground"}
            href="/about"
          >
            About
          </Link>
        </NavbarItem>

        {user && (
          <NavbarItem isActive={isActive("/dashboard")}>
            <Link
              color={isActive("/dashboard") ? "primary" : "foreground"}
              href={
                user?.role === "admin"
                  ? "/dashboard/overview"
                  : "/dashboard/useroverview"
              }
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="px-2">
          <Link href="/cart" className="text-black   relative">
            <Badge color="danger" content={products.length} shape="circle">
              <FaCartArrowDown size={30} />
            </Badge>
          </Link>
        </NavbarItem>

        <NavbarItem>
          {!user ? (
            <Link
              href="/register"
              className="bg-[#02b290] px-5 py-2 rounded-[8px] text-[#ffffff]"
            >
              Login
            </Link>
          ) : (
            <Button
              onClick={handleLogout}
              color="primary"
              className="text-white bg-[#02b290]"
            >
              Logout
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`${
                isActive(item === "Home" ? "/" : `/${item.toLowerCase()}`)
                  ? "text-primary"
                  : "text-foreground"
              }`}
              href={
                item === "Home"
                  ? "/"
                  : item === "Dashboard"
                  ? user.role === "admin"
                    ? "/dashboard/overview"
                    : "/dashboard/useroverview"
                  : `/${item.toLowerCase()}`
              }
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default NavbarMain;
