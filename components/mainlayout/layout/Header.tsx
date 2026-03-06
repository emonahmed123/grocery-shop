import { Button } from "@/components/ui/button";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed inset-0 z-50 top-5 max-w-[1440px] mx-auto ">
      <div>
        <div className=" flex justify-between items-center py-2   px-4 rounded-[22px] bg-[#e1f3f9]">
          {/* Logo */}
          <div>
            <Link href="/">Logo</Link>
          </div>
          {/* Navigation */}
          <nav>
            <ul className="flex gap-5">
              <li>
                <LineHoverLink
                  className="text-gray-400 "
                  href="/about"
                  variant="scribble"
                >
                  Home
                </LineHoverLink>
              </li>

              <li>
                <LineHoverLink
                  href="/product"
                  className="text-gray-400 "
                  variant="scribble"
                >
                  Product
                </LineHoverLink>
              </li>
              <li>
                <LineHoverLink
                  href="/about"
                  className="text-gray-400 "
                  variant="scribble"
                >
                  About
                </LineHoverLink>
              </li>
            </ul>
          </nav>
          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Button variant={"ghost"} className="cursor-pointer ">
              <ShoppingCart className="w-5! h-5!" />
            </Button>
            <Button className="px-8 h-[44px] rounded-full" size={"lg"}>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
