import ContentSection, {
  type ContentSectionData,
} from "@/components/mainlayout/content/ContentSection";
import Container from "@/components/mainlayout/layout/Container";
import PageHero from "@/components/mainlayout/layout/PageHero";
import termsJson from "@/public/data/terms.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Condition | Borobazer",
};

const sections = termsJson as ContentSectionData[];

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Condition" breadcrumb={[{ label: "Terms" }]} />
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-300">
          {sections.map((section) => (
            <ContentSection key={section.id} section={section} />
          ))}
        </div>
      </Container>
    </>
  );
}
