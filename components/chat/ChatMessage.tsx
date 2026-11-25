"use client";

import type { UIMessage } from "ai";
import { Loader2, Star } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import { formatPrice } from "@/lib/assets";

/** One product as the backend's `searchProducts` tool returns it. */
export type ChatProduct = {
  name: string;
  slug: string;
  unit: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  isFlashSale: boolean;
  inStock: boolean;
  category?: string;
  rating: number;
};

/** `**bold**` inside a line; the assistant uses little else. */
const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((piece, index) =>
    piece.startsWith("**") && piece.endsWith("**") && piece.length > 4 ? (
      <strong key={index} className="font-semibold">
        {piece.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{piece}</Fragment>
    ),
  );

/** Plain text with the bits of markdown a chat reply uses: bold and bullet lists. */
const FormattedText = ({ text }: { text: string }) => {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="ml-4 list-disc space-y-0.5">
        {bullets.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flushBullets();
    if (line.trim())
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
  }
  flushBullets();

  return <div className="space-y-1.5">{blocks}</div>;
};

const ProductCard = ({
  product,
  onNavigate,
}: {
  product: ChatProduct;
  onNavigate?: () => void;
}) => (
  <Link
    href={`/products/${product.slug}`}
    onClick={onNavigate}
    className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:border-brand hover:bg-accent"
  >
    <div className="min-w-0">
      <p className="truncate font-medium text-foreground">{product.name}</p>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>{product.unit}</span>
        {product.rating > 0 && (
          <span className="flex items-center gap-0.5">
            <Star
              className="size-3 fill-current text-warning"
              aria-hidden="true"
            />
            {product.rating}
          </span>
        )}
        {!product.inStock && (
          <span className="font-medium text-destructive">Out of stock</span>
        )}
      </p>
    </div>
    <div className="shrink-0 text-right">
      <p className="font-semibold text-foreground">
        {formatPrice(product.price)}
      </p>
      {product.onSale && (
        <p className="text-xs text-muted-foreground line-through">
          {formatPrice(product.regularPrice)}
        </p>
      )}
    </div>
  </Link>
);

type ChatMessageProps = {
  message: UIMessage;
  /** closes the chat on small screens when a product link is followed */
  onNavigate?: () => void;
};

const ChatMessage = ({ message, onNavigate }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const align = isUser ? "end" : "start";

  return (
    <Message align={align}>
      <MessageContent>
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            if (!part.text.trim()) return null;
            return (
              <Bubble
                key={index}
                variant={isUser ? "default" : "muted"}
                align={align}
                className="max-w-5/6"
              >
                <BubbleContent>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{part.text}</p>
                  ) : (
                    <FormattedText text={part.text} />
                  )}
                </BubbleContent>
              </Bubble>
            );
          }

          if (part.type === "tool-searchProducts") {
            if (
              part.state === "input-streaming" ||
              part.state === "input-available"
            ) {
              return (
                <p
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                  Searching products…
                </p>
              );
            }
            if (part.state === "output-available") {
              const products = (part.output as ChatProduct[] | undefined) ?? [];
              if (products.length === 0) return null;
              return (
                <div
                  key={index}
                  className="flex w-full max-w-5/6 flex-col gap-1.5"
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              );
            }
          }

          return null;
        })}
      </MessageContent>
    </Message>
  );
};

export default ChatMessage;
