import { Button } from "@/components/ui/button";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between rounded-[22px] bg-[#e1f3f9fd] px-4 py-2">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                width={131}
                height={30}
                alt="logo"
              />
            </Link>
          </div>
          {/* Navigation */}
          <nav>
            <ul className="flex gap-5">
              <li>
                <LineHoverLink
                  href="/about"
                  className="font-semibold text-gray-600"
                  variant="scribble"
                >
                  Home
                </LineHoverLink>
              </li>

              <li>
                <LineHoverLink
                  href="/product"
                  className="text-gray-600 font-semibold   "
                  variant="scribble"
                >
                  Product
                </LineHoverLink>
              </li>
              <li>
                <LineHoverLink
                  href="/about"
                  className="text-gray-600 font-semibold "
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
            <Button className="px-8 h-[44px]  rounded-full" size={"lg"}>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
