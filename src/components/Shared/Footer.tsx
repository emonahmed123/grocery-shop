import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="pt-[70px] pb-[30px] bg-[#FFFFFF]   font-poppe">
          <div className="max-w-[1170px] mx-auto px-5 xl:px-0">
            <div className="flex lg:items-start justify-between flex-col lg:flex-row gap-y-[60px] mb-[30px]">
              <div className="max-w-[370px]">
                <a className="mb-[40px]" href="">
                  <Image
                    width={130}
                    height={30}
                    src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                    alt="logo"
                  />
                </a>

                <p className="text-brand-muted text-sm leading-7 lg:leading-[27px] lg:text-15px mt-[40px]">
                  We offer high-quality foods and the best delivery service, and
                  the food market you can blindly trust
                </p>
              </div>

              <div className="max-w-[723px]">
                <div className="flex gap-x-[60px] lg:gap-x-[110px] justify-between flex-wrap">
                  <div>
                    <h5 className="text-20px leading-30px font-bold text-[#000] mb-[24px]">
                      Company
                    </h5>

                    <ul>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Careers
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Press
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          About us
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-20px leading-30px font-bold text-[#000] mb-[24px]">
                      About Us
                    </h5>

                    <ul>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Blog
                        </a>
                      </li>

                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Community
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-20px leading-30px font-bold  text-[#000] mb-[24px]">
                      Contact Us
                    </h5>

                    <ul>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          LinkedIn
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Facebook
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Instagram
                        </a>
                      </li>
                      <li className="mb-[18px]">
                        <a
                          className="text-[16px] leading-26px text-[#000]"
                          href=""
                        >
                          Twitter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[1170px] mx-auto h-[1px] bg-[#000] mb-[30px]"></div>

            <div className="flex justify-between flex-col md:flex-row gap-y-[30px]">
              <div className="flex gap-x-[15px] sm:gap-x-[30px]">
                <a className="text-[14px] leading-24px text-[#000]" href="">
                  Terms of Service
                </a>
                <a className="text-[14px] leading-24px text-[#000]" href="">
                  Privacy Policy
                </a>
                <a className="text-[14px] leading-24px text-[#000]" href="">
                  Cookie Policy
                </a>
              </div>
              <p className="text-[14px] leading-24px text-[#000]">
                Copyright © 2024 Company All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
