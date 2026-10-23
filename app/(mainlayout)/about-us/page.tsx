import DownloadApp from "@/components/mainlayout/home/DownloadApp";
import Container from "@/components/mainlayout/layout/Container";
import { assetUrl } from "@/lib/assets";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Borobazer",
};

const media = (file: string) => assetUrl(`/_next/static/media/${file}`);

const storeImages = [
  { src: media("1.07d7bc61.png"), alt: "Shop assistant carrying a crate of apples" },
  { src: media("2.3f856ddb.png"), alt: "Smiling grocer in front of the shelves" },
];

const lifestyleImages = [
  { src: media("3.39e1c1b6.png"), alt: "Woman preparing a fresh salad" },
  { src: media("4.a18c699b.png"), alt: "Family shopping together" },
  { src: media("5.6643c8bf.png"), alt: "Woman unpacking groceries at home" },
];

export default function AboutUsPage() {
  return (
    <>
      <div className="relative h-60 w-full sm:h-80 lg:h-96">
        <Image
          src={assetUrl("/assets/images/about-us.png")}
          alt="Shoppers in the fruit and vegetable aisle"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="py-12 lg:py-16">
        <div className="mx-auto flex max-w-300 flex-col gap-10 text-sm leading-7 text-muted-foreground lg:gap-14 lg:text-base lg:leading-8">
          <section className="flex flex-col gap-5">
            <h1 className="font-manrope text-xl font-bold text-foreground lg:text-2xl">
              About us
            </h1>
            <p>
              We may automatically track certain information about you based
              upon your behavior on the website. We use this information to do
              internal research on our users’ demographics, interests, and
              behavior to better understand, protect and serve our users. This
              information is compiled and analyzed on an aggregated basis. This
              information may include the URL that you just came from (whether
              this URL is on the website or not), which URL you next go to
              (whether this URL is on the website or not), your computer
              browser information, your IP address, and other information
              associated with your interaction with the website.{" "}
              <strong className="font-semibold text-foreground">
                We may also share your Mobile IP/Device IP with third party(ies)
                and to the best of our knowledge, be-life and representations
                given to us by these third party(ies) this information is not
                stored.
              </strong>
            </p>
            <p>
              Our Privacy Policy is incorporated into the Terms and Conditions
              of Use of the website/app, and is subject to change from time to
              time without notice. It is strongly recommended that you
              periodically review our Privacy Policy as posted on the App/Web.
            </p>
            <p>
              Should you have any clarifications regarding this Privacy Policy,
              please do not hesitate to contact us at{" "}
              <a href="mailto:info@borobazar.com" className="text-brand hover:underline">
                info@borobazar.com
              </a>
              .
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {storeImages.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={590}
                height={400}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
            ))}
          </div>

          <section className="flex flex-col gap-5">
            <p>
              To protect against the loss, misuse and alteration of the
              information under its control, the Company has in place
              appropriate physical, electronic and managerial procedures. For
              example, the Company servers are accessible only to authorized
              personnel and your information is shared with employees and
              authorized personnel on a need to know basis to complete the
              transaction and to provide the services requested by you.
              Although the Company endeavour to safeguard the confidentiality
              of your personally identifiable information, transmissions made by
              means of the Internet cannot be made absolutely secure. By using
              the website, you agree that the Company will have no liability
              for disclosure of your information due to errors in transmission
              and/or unauthorized acts of third parties.
            </p>
            <p>
              Please note that the Company will not ask you to share any
              sensitive data or information via email or telephone. If you
              receive any such request by email or telephone, please do not
              respond/divulge any sensitive data or information and forward the
              information relating to the same to{" "}
              <a href="mailto:info@borobazar.com" className="text-brand hover:underline">
                info@borobazar.com
              </a>{" "}
              for necessary action.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            {lifestyleImages.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={390}
                height={270}
                sizes="(min-width: 640px) 33vw, 100vw"
                className="h-auto w-full"
              />
            ))}
          </div>

          <section className="flex flex-col gap-5">
            <p>
              Built on a proprietary technology stack, the Grocers platform
              serves as a convergence of consumers looking for everyday
              essentials, partner stores who serve their needs efficiently, and
              manufacturers looking for a channel to reach a nation of
              consumers. While our technology caters to the burgeoning
              population of urban India, it is ready and poised to serve the
              next 100+ million Indians who are yet to start shopping online.
            </p>
            <p>
              We believe the ecosystem we power can transform the lives of a
              billion Indians significantly over the coming decade. They will
              have access to everyday essentials like groceries at the best
              value, be able to discover products that improve their health and
              wellbeing, and spend more meaningful time with their families –
              with the assurance that their essential needs are being looked
              after by us. On the other side of this virtuous cycle are the
              millions of local businesses catering to a nation’s needs,
              helping create more opportunities for employment, growth, and
              above all, a better life.
            </p>
          </section>

          <Image
            src={media("6.6b4f6620.png")}
            alt="The BoroBazar team wearing face masks"
            width={1200}
            height={400}
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="h-auto w-full"
          />

          <section className="flex flex-col gap-5">
            <h2 className="font-manrope text-xl font-bold text-foreground lg:text-2xl">
              Be safe, be secure!!
            </h2>
            <p>
              BoroBazar is leading the charge in transforming India’s vast,
              unorganized grocery landscape through cutting-edge technology and
              innovation. We believe every Indian deserves the opportunity to
              continually improve their life – a process that often begins at
              home. As part of our mission of helping consumers make healthier,
              better choices when buying everyday products, we make a wide range
              of high-quality grocery and household products accessible,
              affordable, and available right at their doorsteps.
            </p>
            <div>
              <p className="text-base font-medium text-foreground lg:text-lg">
                For media enquiries please contact us at:{" "}
                <a href="mailto:press@borobazar.com" className="text-brand hover:underline">
                  press@borobazar.com
                </a>
                .
              </p>
              <p>
                For all other inquiries, visit our{" "}
                <Link href="/contact-us" className="text-brand hover:underline">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </div>
          </section>
        </div>
      </Container>

      <DownloadApp />
    </>
  );
}
