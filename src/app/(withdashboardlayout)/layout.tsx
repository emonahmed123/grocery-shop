import SideNav from "@/components/dashboard/SideNav";
import TopNav from "@/components/dashboard/TopNav";
import { getToken } from "@/utils/actions/Authaction";

const Dashlayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
  // console.log(UserImage);

  return (
    <div className=" h-[100vh] ">
      <TopNav UserData={UserImage.data} />
      <div className="grid grid-cols-5">
        <div className="col-span-1 w-[80px] md:w-[200px] fixed top-[60px]">
          <SideNav />
        </div>
        <div className="col-span-4 px-2 py-2 md:left-[20%] left-[20%]  relative top-[2%] sm:top-[4%]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashlayout;
