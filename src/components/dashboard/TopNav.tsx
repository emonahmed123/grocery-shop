/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserInfo } from "@/utils/actions/Authaction";

import { User } from "@nextui-org/react";
import Link from "next/link";

const TopNav = async ({ UserData }: { UserData: any }) => {
  const user = await getUserInfo();
  console.log("navbarrr", UserData?.image);
  return (
    <>
      <div className="bg-white flex justify-between items-center px-8 py-2 border-b border-gray-200 fixed     top-0 left-0 right-0 z-50">
        {/* for md device  */}
        <div className="block">
          <Link href="/" className="font-bold text-inherit">
            EAS<span className="text-primary">Grocery</span>
          </Link>
        </div>
        <div className="flex justify-self-auto">
          <div>
            {user && (
              <User
                name={user.name}
                description={user.role}
                avatarProps={{
                  src: `${UserData?.image}`,
                  alt: "Image",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
