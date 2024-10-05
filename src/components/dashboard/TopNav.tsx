import { getUserInfo } from "@/utils/actions/Authaction";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { User } from "@nextui-org/react";
import Link from "next/link";

const TopNav = async () => {
  const user = await getUserInfo();
  return (
    <>
      <Navbar isBordered>
        {/* for md device  */}
        <NavbarBrand className="block">
          <Link href="/" className="font-bold text-inherit">
            EAS<span className="text-primary">Grocery</span>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            {user && (
              <User
                name={user.name}
                description={user.role}
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                  alt: "Image",
                }}
              />
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default TopNav;
