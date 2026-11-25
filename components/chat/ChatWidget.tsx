"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ChatMessage from "@/components/chat/ChatMessage";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Message } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { cn } from "@/lib/utils";

// the backend takes at most 20 messages of up to 1000 characters each
const MAX_MESSAGES = 20;
const MAX_LENGTH = 1000;

const SUGGESTIONS = [
  "What's on sale today?",
  "Show me fresh fruits",
  "Milk under $5",
  "Ideas for a quick dinner",
];

// white icon buttons on the green header, which no <Button> variant covers
const headerButton =
  "flex size-8 items-center justify-center rounded-md text-brand-foreground transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none";

const transport = new DefaultChatTransport({
  api: "/api/chat",
  // only the latest messages, so a long chat keeps working
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-MAX_MESSAGES) },
  }),
});

/** The backend answers errors as JSON (`{ message }`); show that message. */
const errorText = (error: Error) => {
  try {
    const parsed = JSON.parse(error.message) as { message?: string };
    if (parsed.message) return parsed.message;
  } catch {
    // not JSON: a network error or one from the stream
  }
  return error.message || "Something went wrong, please try again";
};

/** Floating shopping-assistant chat, bottom right on every store page. */
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    setMessages,
    clearError,
  } = useChat({ transport });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  // dots until the assistant's first words arrive
  const isWaiting =
    status === "submitted" ||
    (status === "streaming" && lastMessage?.role === "user");

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Escape closes the chat
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    if (error) clearError();
    sendMessage({ text: trimmed.slice(0, MAX_LENGTH) });
    setInput("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  // Enter sends, Shift+Enter adds a line
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      send(input);
    }
  };

  const startOver = () => {
    stop();
    setMessages([]);
    clearError();
    inputRef.current?.focus();
  };

  // product links: on a phone the chat covers the page, so get out of the way
  const closeOnSmallScreen = () => {
    if (window.matchMedia("(max-width: 639px)").matches) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        // on larger screens this frame keeps the panel between the header and
        // the chat button, and the panel shrinks to fit on short windows
        <div className="pointer-events-none fixed inset-0 z-50 flex sm:inset-x-auto sm:top-24 sm:right-6 sm:bottom-24 sm:items-end">
          <section
            role="dialog"
            aria-label="Shopping assistant"
            className="pointer-events-auto flex h-full w-full flex-col overflow-hidden bg-background animate-in fade-in-0 slide-in-from-bottom-4 sm:h-150 sm:max-h-full sm:w-95 sm:rounded-xl sm:border sm:shadow-2xl"
          >
            <header className="flex items-center justify-between gap-2 bg-brand px-4 py-3 text-brand-foreground">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">BoroBazar Assistant</h2>
                  <p className="text-xs text-brand-foreground/80">
                    Find products, prices and deals
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {messages.length > 0 && (
                  <button
                    type="button"
                    className={headerButton}
                    onClick={startOver}
                    aria-label="Start a new chat"
                    title="New chat"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  className={headerButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="size-4" />
                </button>
              </div>
            </header>

            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <MessageCircle className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Hi! How can I help?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ask me about products, prices, offers or what to cook.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="rounded-full border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-brand hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // follows the reply as it streams; each question is pinned near the top
              <MessageScrollerProvider autoScroll>
                <div className="flex min-h-0 flex-1 flex-col px-4 py-2">
                  <MessageScroller>
                    <MessageScrollerViewport aria-label="Conversation">
                      <MessageScrollerContent>
                        {messages.map((message) => (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor={message.role === "user"}
                          >
                            <ChatMessage
                              message={message}
                              onNavigate={closeOnSmallScreen}
                            />
                          </MessageScrollerItem>
                        ))}

                        {isWaiting && (
                          <MessageScrollerItem>
                            <Message>
                              <Bubble variant="muted">
                                <BubbleContent>
                                  <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Loader2
                                      className="size-3.5 animate-spin"
                                      aria-hidden="true"
                                    />
                                    Thinking…
                                  </span>
                                </BubbleContent>
                              </Bubble>
                            </Message>
                          </MessageScrollerItem>
                        )}

                        {error && (
                          <MessageScrollerItem>
                            <Message>
                              <Bubble
                                variant="destructive"
                                className="max-w-full"
                              >
                                <BubbleContent>
                                  <p>{errorText(error)}</p>
                                  <button
                                    type="button"
                                    onClick={() => regenerate()}
                                    className="mt-1 font-medium underline underline-offset-2"
                                  >
                                    Try again
                                  </button>
                                </BubbleContent>
                              </Bubble>
                            </Message>
                          </MessageScrollerItem>
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </div>
              </MessageScrollerProvider>
            )}

            <form onSubmit={onSubmit} className="border-t p-3">
              <InputGroup>
                <InputGroupTextarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask about products…"
                  aria-label="Your message"
                  rows={1}
                  maxLength={MAX_LENGTH}
                  className="max-h-32 min-h-9"
                />
                <InputGroupAddon align="inline-end" className="self-end">
                  {isBusy ? (
                    <InputGroupButton
                      variant="outline"
                      size="icon-sm"
                      onClick={() => stop()}
                      aria-label="Stop answering"
                    >
                      <Square className="fill-current" />
                    </InputGroupButton>
                  ) : (
                    <InputGroupButton
                      type="submit"
                      variant="brand"
                      size="icon-sm"
                      disabled={!input.trim()}
                      aria-label="Send message"
                    >
                      <ArrowUp />
                    </InputGroupButton>
                  )}
                </InputGroupAddon>
              </InputGroup>
            </form>
          </section>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat" : "Chat with our shopping assistant"}
        aria-expanded={isOpen}
        className={cn(
          "fixed right-4 bottom-4 z-50 size-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none sm:right-6 sm:bottom-6",
          // on a phone the open chat fills the screen and has its own close button
          isOpen ? "hidden sm:flex" : "flex",
        )}
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <MessageCircle className="size-6" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
