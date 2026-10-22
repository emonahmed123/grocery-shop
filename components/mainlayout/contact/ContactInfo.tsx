import Container from "@/components/mainlayout/layout/Container";
import { AtSign, Compass, PhoneCall } from "lucide-react";

const contactDetails = [
  {
    title: "Office Location",
    icon: Compass,
    lines: ["2756 Quiet Valley Lane, Reseda,", "California, United States"],
  },
  {
    title: "Call us anytime",
    icon: PhoneCall,
    lines: ["Change the design through a range", "+89 5631 564 +88 5321 036"],
  },
  {
    title: "Send Mail",
    icon: AtSign,
    lines: ["support@demoagency.com", "hire.us@demoteam.io"],
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
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ContactInfo;
