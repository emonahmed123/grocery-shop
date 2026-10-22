import Container from "@/components/mainlayout/layout/Container";
import { siteOwner } from "@/lib/siteConfig";
import { AtSign, Compass, PhoneCall } from "lucide-react";

type ContactLine = { text: string; href?: string };

const contactDetails: { title: string; icon: typeof Compass; lines: ContactLine[] }[] = [
  {
    title: "Office Location",
    icon: Compass,
    lines: [
      { text: `${siteOwner.location.area},` },
      { text: siteOwner.location.country },
    ],
  },
  {
    title: "Call us anytime",
    icon: PhoneCall,
    lines: [
      { text: siteOwner.name },
      { text: siteOwner.phone.display, href: siteOwner.phone.href },
    ],
  },
  {
    title: "Send Mail",
    icon: AtSign,
    lines: [{ text: siteOwner.email, href: `mailto:${siteOwner.email}` }],
  },
];

const ContactInfo = () => {
  return (
    <Container>
      <div className="mx-auto grid max-w-355 gap-8 px-5 pt-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 lg:px-0 xl:px-12">
        {contactDetails.map(({ title, icon: Icon, lines }) => (
          <div
            key={title}
            className="flex max-w-xs flex-col lg:max-w-sm lg:flex-row xl:pr-7"
          >
            <div className="w-14 shrink-0 xl:w-16">
              <Icon
                className="size-12 text-muted-foreground xl:size-14"
                strokeWidth={1.25}
              />
            </div>
            <div className="mt-4 lg:mt-0 lg:pl-3 2xl:pl-4">
              <h3 className="mb-2 font-manrope text-base font-bold text-foreground lg:mb-2.5 xl:text-lg">
                {title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {lines.map(({ text, href }) =>
                  href ? (
                    <a key={text} href={href} className="block transition-colors hover:text-brand">
                      {text}
                    </a>
                  ) : (
                    <span key={text} className="block">
                      {text}
                    </span>
                  ),
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ContactInfo;
