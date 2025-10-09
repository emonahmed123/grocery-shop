import AboutDetails from "@/components/about/AboutDetails";
import Banner from "@/components/about/Banner";
import Eeaer from "@/components/about/Eeaer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "About",
  description: "BoroBazer grocery-store",
};

const About = () => {
  return (
    <div>
      <Banner />
      <AboutDetails />
      <Eeaer />
    </div>
  );
};

export default About;
