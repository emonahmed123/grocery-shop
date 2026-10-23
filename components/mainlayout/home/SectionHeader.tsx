type SectionHeaderProps = {
  title: string;
  description: string;
};

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <header className="mb-5 pb-2 text-center lg:pb-3 xl:mb-6 xl:pb-4">
      <h2 className="font-manrope text-lg font-bold text-foreground lg:text-xl xl:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-7 text-muted-foreground lg:mt-2.5 xl:mt-3 xl:text-base">
        {description}
      </p>
    </header>
  );
};

export default SectionHeader;
