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
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { FaCartArrowDown } from "react-icons/fa";
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
const NavbarMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Home", "Categories", "Dashboard"];
  const products = useAppSelector((store) => store.cart.products);
  const pathname = usePathname();
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
      className="bg-transparent"
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
          EAS<span className="text-primary">grocery</span>
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem >
          <Link color={isActive("/") ? "primary" : "foreground"} href="/">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={isActive("/categories")}>
          <Link
            color={isActive("/categories") ? "primary" : "foreground"}
            href="/"
          >
            Categories
          </Link>
        </NavbarItem>

        <NavbarItem isActive={isActive("/dashboard")}>
          <Link
            color={isActive("/dashboard") ? "primary" : "foreground"}
            href="/dashboard"
          >
            Dashboard
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>



          <Button
            as={Link}
            // color="redd"
            href="/cart"
            isIconOnly
            variant="shadow"
            className="text-white  bg-primary relative"
          >

            <FaCartArrowDown size={20} />


          </Button>
          <sup className="text-red-600 text-[18px] absolute top-4 left-6">{products.length}</sup>
        </NavbarItem>


        <NavbarItem>
          <Button
            as={Link}
            // color="redd"
            href="/auth"
            variant="shadow"
            className="text-white  bg-primary"
          >
            Login
          </Button>
        </NavbarItem>

      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`${isActive(`${item === "Home" ? "/" : `/${item}`}`)
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
  )
}
export default NavbarMain