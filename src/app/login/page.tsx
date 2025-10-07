import Login from "@/components/Auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "BoroBazer Login Page",
};
const Loginpage = () => {
  return (
    <section className="flex justify-center items-center  h-[100vh] max-w-[1170px] mx-auto px-5 xl:px-0 ">
      <Login />
    </section>
  );
};

export default Loginpage;
