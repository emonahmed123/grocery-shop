// import Cart from '@/components/ui/Cart';
import Eeaer from "@/components/about/Eeaer";
import OrderSummary from "@/components/Cart/OrderSummary";

const Cartpage = () => {
  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 xl:px-0 gap-5 py-[50px] md:py-[90px] flex flex-col  md:flex-row justify-between items-center">
        {/* <Cart></Cart> */}
        <OrderSummary />
      </div>

      <Eeaer />
    </>
  );
};

export default Cartpage;
