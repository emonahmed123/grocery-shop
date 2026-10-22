import ContactForm from "@/components/mainlayout/contact/ContactForm";
import Container from "@/components/mainlayout/layout/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { assetUrl } from "@/lib/assets";

const supportTeam = [
  { name: "Jessica Twain", image: "/assets/images/support/1.png" },
  { name: "Jason", image: "/assets/images/support/2.png" },
  { name: "Jessica", image: "/assets/images/support/3.png" },
  { name: "Hayden", image: "/assets/images/support/4.png" },
];

const ContactSupport = () => {
  return (
    <Container className="mb-12 lg:mb-14 xl:mb-16">
      <div className="relative z-10 mx-auto -mt-8 flex max-w-355 flex-wrap rounded-md bg-background p-5 shadow-md md:p-7 lg:p-10 xl:px-16 xl:py-12">
        <div className="mb-8 w-full md:w-1/2 md:pr-8 lg:mb-0 xl:w-3/5 2xl:pr-24">
          <h2 className="mb-3 font-manrope text-lg font-bold text-foreground lg:mb-4 lg:text-xl xl:mb-5 xl:text-2xl">
            Support is our main priority
          </h2>
          <p className="text-sm leading-7 text-muted-foreground lg:text-base xl:leading-8">
            We created reusable react components, and modern mono repo
            architecture, so you can build multiple apps with common components.
            You can use these landing for your react app. It&apos;s super easy
            to deploy, we have provided complete firebase integration it.
          </p>
          <ul className="mt-5 flex gap-2">
            {supportTeam.map((member) => (
              <li key={member.image}>
                <Avatar className="size-11">
                  <AvatarImage src={assetUrl(member.image)} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full pt-1.5 md:w-1/2 lg:pl-12 xl:w-2/5">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
};

export default ContactSupport;
