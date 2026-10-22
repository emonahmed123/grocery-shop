import Link from "next/link";
import { Fragment } from "react";

// Matches **bold** and [label](href) inside content strings.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

type RichTextProps = {
  text: string;
};

/** Renders a content string with inline **bold** and [link](href) markup. */
const RichText = ({ text }: RichTextProps) => {
  return text.split(TOKEN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={index} href={link[2]} className="text-brand hover:underline">
          {link[1]}
        </Link>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
};

export default RichText;
