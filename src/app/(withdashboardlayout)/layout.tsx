import SideNav from "@/components/dashboard/SideNav";
import TopNav from "@/components/dashboard/TopNav";

const Dashlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=" h-[100vh]">
      <TopNav />
      <div className="grid grid-cols-5 gap-5">
        <div>
          <SideNav />
        </div>
        <div className="col-span-4">{children}</div>
      </div>
    </div>
  );
};

export default Dashlayout;
