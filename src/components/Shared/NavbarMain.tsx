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
const NavbarMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Home", "Categories", "Dashboard"];
  const products = useAppSelector((store) => store.cart.products);
  const pathname = usePathname();
  const { user, handleLogout } = useAuth();
  const isActive = (href: string) => pathname === href;

  console.log(user);

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
          <p className="font-bold text-inherit">
            EAS<span className="text-primary">grocery</span>
          </p>
        </NavbarBrand>
      </NavbarContent>
      {/* for md device  */}
      <NavbarBrand className="hidden sm:block">
        <p className="font-bold text-inherit">
          Eas<span className="text-primary">Grocery</span>
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color={isActive("/") ? "primary" : "foreground"} href="/">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={isActive("/categories")}>
          <Link
            color={isActive("/categories") ? "primary" : "foreground"}
            href="/product"
          >
            Product
          </Link>
        </NavbarItem>

        {user && (
          <NavbarItem isActive={isActive("/dashboard")}>
            <Link
              color={isActive("/dashboard") ? "primary" : "foreground"}
              href={
                user.role === "admin"
                  ? "/dashboard/allproduct"
                  : "/dashboard/myorder"
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
              color="primary"
              href="/login"
              variant="shadow"
              className="text-white"
            >
              Login
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              color="primary"
              variant="shadow"
              className="text-black"
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
                isActive(`${item === "Home" ? "/" : `/${item}`}`)
                  ? "text-primary"
                  : "text-foreground"
              }`}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
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
