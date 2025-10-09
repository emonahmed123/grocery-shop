import Image from "next/image";

const banner = () => {
  return (
    <div className=" relative  flex justify-center h-[250px] lg:h-96 2xl:h-[500px] w-full bg-cover bg-no-repeat bg-center">
      <Image
        src="https://borobazar.vercel.app/assets/images/about-us.png"
        alt="About page Banner"
        fill
        className="2xl:object-cover "
      />
    </div>
  );
};

export default banner;
