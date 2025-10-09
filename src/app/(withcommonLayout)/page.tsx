import Banner from "@/components/home/Banner";
import Categories from "@/components/home/Categories";
import Faq from "@/components/home/Faq";
import Marque from "@/components/home/Marque";
import Newstls from "@/components/home/Newstls";
import Offer from "@/components/home/Offer";
import PopularProducts from "@/components/home/PopularProducts";
import Shpping from "@/components/home/Shpping";
import { Suspense } from "react";

const Home = async () => {
  return (
    <div>
      <Banner></Banner>
      <Categories></Categories>
      <Suspense fallback={<div>loading... </div>}>
        <PopularProducts></PopularProducts>
      </Suspense>
      <Offer></Offer>
      <Shpping></Shpping>
      <Marque></Marque>
      <Faq></Faq>
      <Newstls></Newstls>
    </div>
  );
};

export default Home;
