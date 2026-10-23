import ContentSection, {
  type ContentSectionData,
} from "@/components/mainlayout/content/ContentSection";
import Container from "@/components/mainlayout/layout/Container";
import PageHero from "@/components/mainlayout/layout/PageHero";
import privacyJson from "@/public/data/privacy.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Borobazer",
};

const sections = privacyJson as ContentSectionData[];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy & Policy" breadcrumb={[{ label: "Privacy" }]} />
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="flex flex-col gap-10 md:flex-row lg:gap-16 xl:px-4">
          <nav
            aria-label="Privacy policy sections"
            className="shrink-0 md:w-56 lg:w-72"
          >
            <ul className="flex flex-col gap-5 md:sticky md:top-28">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm font-medium text-foreground transition-colors hover:text-brand lg:text-base"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 flex-1">
            {sections.map((section) => (
              <ContentSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
