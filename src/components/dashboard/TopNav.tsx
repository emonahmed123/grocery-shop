
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
                <NavbarBrand className="block">
                    <Link href="/" className="font-bold text-inherit">
                        EAS<span className="text-primary">
                            Grocery
                        </span>
                    </Link>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        {user && <p className="font-semibold">{user?.name}</p>}
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
};

export default TopNav;