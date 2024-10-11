/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Badge,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { FaCartArrowDown } from "react-icons/fa";
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { useAuth } from "@/lib/AuthProviders";
import Image from "next/image";
import { signOut } from "next-auth/react";
type userProps = {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
};

const NavbarMain = ({ session }: { session: userProps | null }) => {
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

  console.log(session);

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
            <Button
              as={Link}
              href="/login"
              className="bg-[#02b290] text-[#ffffff]"
            >
              Login
            </Button>
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
              size="lg"
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
