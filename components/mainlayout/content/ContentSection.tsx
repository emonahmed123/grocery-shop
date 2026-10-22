import RichText from "@/components/mainlayout/content/RichText";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

export type ContentSectionData = {
  id: string;
  title: string;
  blocks: ContentBlock[];
};

type ContentSectionProps = {
  section: ContentSectionData;
};

/** One titled block of legal/policy copy. */
const ContentSection = ({ section }: ContentSectionProps) => {
  return (
    <section id={section.id} className="mb-10 scroll-mt-28 last:mb-0 lg:mb-12">
      <h2 className="mb-4 font-manrope text-lg font-semibold text-foreground md:text-xl lg:mb-6">
        {section.title}
      </h2>
      <div className="flex flex-col gap-5 text-sm leading-7 text-muted-foreground lg:text-base">
        {section.blocks.map((block, index) =>
          block.type === "p" ? (
            <p key={index}>
              <RichText text={block.text} />
            </p>
          ) : (
            <ol key={index} className="flex list-decimal flex-col gap-2 pl-8">
              {block.items.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ol>
          ),
        )}
      </div>
    </section>
  );
};

export default ContentSection;
