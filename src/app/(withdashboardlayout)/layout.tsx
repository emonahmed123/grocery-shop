import SideNav from "@/components/dashboard/SideNav";
import TopNav from "@/components/dashboard/TopNav";

const Dashlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=" h-[100vh]  ">
      <TopNav />
      <div className="grid grid-cols-5">
        <div className="col-span-1 w-[200px] fixed">
          <SideNav />
        </div>
        <div className="col-span-4 px-2 py-2 md:left-[25%] left-[25%]  relative ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashlayout;
