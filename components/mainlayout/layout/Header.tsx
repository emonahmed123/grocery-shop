import CartDrawer from "@/components/cart/CartDrawer";
import DesktopNav from "@/components/mainlayout/layout/DesktopNav";
import MobileNav from "@/components/mainlayout/layout/MobileNav";
import UserMenu from "@/components/mainlayout/layout/UserMenu";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-5 md:px-4">
      <div className="mx-auto max-w-360">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-accent/95 px-2 py-2 shadow-sm backdrop-blur md:rounded-3xl md:px-4">
          {/* Logo, with the menu button in front of it on small screens */}
          <div className="flex items-center gap-1">
            <MobileNav />
            <Link href="/" aria-label="BoroBazar home">
              <Image
                src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                width={131}
                height={30}
                alt="BoroBazar"
                priority
                className="h-auto w-28 md:w-32"
              />
            </Link>
          </div>

          <DesktopNav />

          {/* User Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <CartDrawer />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
