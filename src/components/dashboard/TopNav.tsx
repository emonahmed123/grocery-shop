
import { getUserInfo } from "@/utils/actions/Authaction";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";

const TopNav = async () => {
    const user = await getUserInfo();
    return (
        <>
            <Navbar>
                {/* for md device  */}
                <NavbarBrand className="hidden md:block">
                    <Link href="/" className="font-bold text-inherit">
                        Baby<span className="text-primary">Bliss</span>
                    </Link>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        {user && <p className="font-semibold">{user?.username}</p>}
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
};

export default TopNav;