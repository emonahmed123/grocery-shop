import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";

import { findOrderId, orderLookupReply } from "@/lib/chatOrderLookup";

// The chat widget posts here, and this passes the conversation on to the
// backend and streams its reply straight back. The browser never learns the
// backend's address (BACKEND_URL stays on the server), like every other call.
// Questions about an order id are answered here instead, from the logged-in
// customer's own orders.

// The reply can take a while when the assistant looks up several products.
export const maxDuration = 60;

/** The text of the customer's latest message, if the conversation ends with one. */
const latestUserText = (body: string) => {
  try {
    const { messages } = JSON.parse(body) as { messages?: UIMessage[] };
    const last = messages?.at(-1);
    if (last?.role !== "user") return "";
    return last.parts.map((part) => (part.type === "text" ? part.text : "")).join(" ");
  } catch {
    return "";
  }
};

/** A finished reply in the same stream format the backend sends. */
const textReply = (text: string) =>
  createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "order" });
        writer.write({ type: "text-delta", id: "order", delta: text });
        writer.write({ type: "text-end", id: "order" });
        writer.write({ type: "finish" });
      },
    }),
  });

export async function POST(request: Request) {
  const body = await request.text();

  const orderId = findOrderId(latestUserText(body));
  if (orderId) return textReply(await orderLookupReply(orderId));

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.error("chat: BACKEND_URL is not set");
    return Response.json({ success: false, message: "The chat assistant is not available" }, { status: 503 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // closing the chat stops the backend too, so it stops paying for tokens
      signal: request.signal,
    });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    console.error("chat: the backend could not be reached", error);
    return Response.json({ success: false, message: "The chat assistant is not available" }, { status: 502 });
  }

  // Pass the stream (or the backend's JSON error) through unchanged.
  const headers = new Headers();
  for (const name of ["content-type", "cache-control", "x-vercel-ai-ui-message-stream"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-accel-buffering", "no");

  return new Response(upstream.body, { status: upstream.status, headers });
}
