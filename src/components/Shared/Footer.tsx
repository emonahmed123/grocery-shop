const Footer = () => {
    return (
        <>
            <footer>
                <div className="pt-[70px] pb-[30px] bg-gradient-to-tr from-primary to-yellow-500  font-Poppis">
                    <div className="max-w-[1170px] mx-auto px-5 xl:px-0">
                        <div className="flex lg:items-start justify-between flex-col lg:flex-row gap-y-[60px] mb-[30px]">
                            <div className="max-w-[370px]">
                                <a className="mb-[40px]" href="">
                                    EAS<span className="text-secondary">grocery</span>
                                </a>

                                <p className="text-16px leading-28px mt-[30px] text-white">
                                    Find best quality foods meat ,fish  all over there.good quality and better other
                                </p>
                            </div>

                            <div className="max-w-[723px]">
                                <div className="flex gap-x-[60px] lg:gap-x-[110px] justify-between flex-wrap">
                                    <div>
                                        <h5 className="text-20px leading-30px font-bold text-white mb-[24px]">
                                            Company
                                        </h5>

                                        <ul>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Careers
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Press
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    About us
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-20px leading-30px font-bold text-white mb-[24px]">
                                            About Us
                                        </h5>

                                        <ul>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Blog
                                                </a>
                                            </li>

                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Community
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    FAQ
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-20px leading-30px font-bold  text-white mb-[24px]">
                                            Contact Us
                                        </h5>

                                        <ul>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    LinkedIn
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Facebook
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
                                                    href=""
                                                >
                                                    Instagram
                                                </a>
                                            </li>
                                            <li className="mb-[18px]">
                                                <a
                                                    className="text-[16px] leading-26px text-white"
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

                        <div className="max-w-[1170px] mx-auto h-[1px] bg-white mb-[30px]"></div>

                        <div className="flex justify-between flex-col md:flex-row gap-y-[30px]">
                            <div className="flex gap-x-[15px] sm:gap-x-[30px]">
                                <a className="text-[14px] leading-24px text-white" href="">
                                    Terms of Service
                                </a>
                                <a className="text-[14px] leading-24px text-white" href="">
                                    Privacy Policy
                                </a>
                                <a className="text-[14px] leading-24px text-white" href="">
                                    Cookie Policy
                                </a>
                            </div>
                            <p className="text-[14px] leading-24px text-white">
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