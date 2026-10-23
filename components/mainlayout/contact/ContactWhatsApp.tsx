import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { Button } from "@/components/ui/button";
import { siteOwner } from "@/lib/siteConfig";
import { PhoneCall } from "lucide-react";

/** Direct ways to reach the owner: a WhatsApp chat or a phone call. */
const ContactWhatsApp = () => {
  return (
    <div className="flex flex-col items-center gap-5 rounded-md border bg-fill-neutral p-6 text-center lg:p-8">
      <WhatsappIcon className="size-14 text-whatsapp" />
      <div>
        <h3 className="mb-1.5 font-manrope text-lg font-bold text-foreground">
          Talk to us on WhatsApp
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Send a message or call {siteOwner.name} directly on WhatsApp or by phone.
        </p>
      </div>
      <a
        href={siteOwner.phone.href}
        className="font-manrope text-xl font-bold text-foreground transition-colors hover:text-brand"
      >
        {siteOwner.phone.display}
      </a>
      <div className="grid w-full gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        <Button asChild variant="whatsapp" size="lg" className="h-12">
          <a href={siteOwner.whatsappHref} target="_blank" rel="noreferrer">
            <WhatsappIcon className="size-5" />
            Chat on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12">
          <a href={siteOwner.phone.href}>
            <PhoneCall className="size-5" />
            Call Now
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ContactWhatsApp;
