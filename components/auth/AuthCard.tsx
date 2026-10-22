import Image from "next/image";
import Link from "next/link";

import { assetUrl } from "@/lib/assets";

type AuthCardProps = {
  title: string;
  subtitle: React.ReactNode;
  image: string;
  children: React.ReactNode;
};

/** Photo on the left, form on the right; the photo hides on small screens. */
const AuthCard = ({ title, subtitle, image, children }: AuthCardProps) => (
  <div className="mx-auto flex w-full max-w-250 overflow-hidden rounded-lg border border-border bg-background">
    <div className="relative hidden w-1/2 bg-fill-thumbnail md:block">
      <Image
        src={assetUrl(image)}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 500px, 0px"
        className="object-cover"
      />
    </div>
    <div className="flex w-full flex-col justify-center px-5 py-8 sm:px-10 md:w-1/2 md:py-12 lg:px-12">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Link href="/" aria-label="BoroBazar home">
          <Image
            src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
            width={131}
            height={30}
            alt="BoroBazar"
          />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

export default AuthCard;
