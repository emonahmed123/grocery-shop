/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { getToken, getUserInfo } from "@/utils/actions/Authaction";

import Link from "next/link";

import Image from "next/image";

import AddDrowop from "../ui/AddDrowop";
const TopNav = async () => {
  const token = await getToken();
  const UserImages = await fetch(
    "https://grocery-store-server-orpin.vercel.app/api/auth/me",
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const UserImage = await UserImages.json();
  console.log(UserImage.data);

  // console.log("navbarrr", UserData?.image);

  return (
    <>
      <div className="bg-white flex justify-between items-center px-8 py-2 border-b border-gray-200 fixed     top-0 left-0 right-0 z-50">
        {/* for md device  */}
        <div className="block">
          <Link href="/" className="font-bold text-inherit">
            <Image
              src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
              width={131}
              height={30}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex justify-self-auto">
          <div>
            <AddDrowop UserData={UserImage?.data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
