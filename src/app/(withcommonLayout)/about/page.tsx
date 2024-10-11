import AboutDetails from "@/components/about/AboutDetails";
import Banner from "@/components/about/Banner";
import Eeaer from "@/components/about/Eeaer";
import React from "react";

const About = () => {
  return (
    <div className="font-manrope">
      <Banner />
      <AboutDetails />
      <Eeaer />
    </div>
  );
};

export default About;
