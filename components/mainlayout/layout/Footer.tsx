import { FacebookIcon, GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import Container from "@/components/mainlayout/layout/Container";
import NewsletterForm from "@/components/mainlayout/layout/NewsletterForm";
import { Separator } from "@/components/ui/separator";
import { assetUrl } from "@/lib/assets";
import { siteOwner } from "@/lib/siteConfig";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { name: "Facebook", href: siteOwner.facebook, icon: FacebookIcon, color: "text-facebook" },
  { name: "GitHub", href: siteOwner.github, icon: GithubIcon, color: "text-github" },
  { name: "LinkedIn", href: siteOwner.linkedin, icon: LinkedinIcon, color: "text-linkedin" },
];

const linkColumns = [
  {
    title: "About Us",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Contact us", href: "/contact-us" },
      { label: "About team", href: "/about-us" },
      { label: "Customer Support", href: "/contact-us" },
    ],
  },
  {
    title: "Our Information",
    links: [
      { label: "Privacy policy update", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
      { label: "Return Policy", href: "/privacy" },
      { label: "Site Map", href: "/" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Announcements", href: "/" },
      { label: "Answer center", href: "/faq" },
      { label: "Discussion boards", href: "/" },
      { label: "Giving works", href: "/" },
    ],
  },
];

const paymentMethods = [
  { name: "Mastercard", icon: "mastercard", width: 34 },
  { name: "Visa", icon: "visa", width: 50 },
  { name: "PayPal", icon: "paypal", width: 76 },
  { name: "JCB", icon: "jcb", width: 26 },
  { name: "Skrill", icon: "skrill", width: 39 },
];

const Footer = () => {
  return (
    <footer className="mt-12 lg:mt-14 2xl:mt-16">
      <Container>
        <div className="grid grid-cols-2 gap-5 pb-12 sm:gap-9 md:grid-cols-7 lg:gap-11 xl:grid-cols-12 xl:gap-7">
          <div className="col-span-full mb-4 border-b pb-10 sm:col-span-1 sm:mb-0 sm:border-b-0 sm:pb-0 md:col-span-3">
            <div className="mx-auto flex max-w-75 flex-col pb-6 text-center sm:ml-0 sm:pb-5 sm:text-left">
              <Link href="/" className="mx-auto mb-3 inline-block sm:ml-0 lg:mb-5">
                <Image
                  src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                  alt="BoroBazar"
                  width={131}
                  height={30}
                />
              </Link>
              <p className="text-sm leading-7 text-muted-foreground">
                We offer high-quality foods and the best delivery service, and
                the food market you can blindly trust
              </p>
            </div>
            <ul className="flex justify-center gap-4 sm:justify-start md:gap-5">
              {socialLinks.map(({ name, href, icon: Icon, color }) => (
                <li key={name} className="transition hover:opacity-80">
                  <a href={href} target="_blank" rel="noreferrer" aria-label={`${siteOwner.name} on ${name}`}>
                    <Icon className={`size-5 ${color}`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {linkColumns.map((column) => (
            <div key={column.title} className="pb-3.5 sm:pb-0 md:col-span-2">
              <h3 className="mb-4 pb-0.5 text-base font-medium text-foreground sm:mb-5 lg:mb-6 lg:text-lg">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors duration-200 hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-full flex flex-col border-t pt-8 sm:col-span-1 sm:border-t-0 sm:pt-0 md:col-span-4 md:col-start-4 xl:col-span-3 xl:col-start-auto xl:pl-6">
            <h3 className="mb-4 text-base font-medium text-foreground lg:mb-6 lg:pb-0.5 lg:text-lg">
              Subscribe Now
            </h3>
            <p className="max-w-100 text-sm leading-7 text-muted-foreground">
              Subscribe your email for newsletter and featured news based on
              your interest
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <Container className="pb-20 lg:pb-7">
        <Separator />
        <div className="flex flex-col items-center gap-3.5 pt-6 text-center md:flex-row md:justify-between lg:pt-7">
          <p className="text-sm leading-7 text-foreground">
            &copy; Copyright {new Date().getFullYear()} {siteOwner.name}. All
            rights reserved
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:gap-7">
            {paymentMethods.map((method) => (
              <li key={method.name} className="inline-flex">
                <Image
                  src={assetUrl(`/assets/images/payment/${method.icon}.svg`)}
                  alt={method.name}
                  width={method.width}
                  height={20}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
