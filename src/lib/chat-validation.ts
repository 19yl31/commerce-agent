import { CHAT_LIMITS, type ChatMessage, type ChatRequest } from "@/lib/chat-contract";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function sanitizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => isObject(item))
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: sanitizeText(item.content, CHAT_LIMITS.maxMessageLength),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-CHAT_LIMITS.maxMessages);
}

export function parseChatRequest(body: unknown):
  | { ok: true; data: ChatRequest }
  | { ok: false; error: string } {
  if (!isObject(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const messages = sanitizeMessages(body.messages);
  const input = sanitizeText(body.input, CHAT_LIMITS.maxInputLength);
  const imageDataUrl = sanitizeText(body.imageDataUrl, CHAT_LIMITS.maxImageDataUrlLength);
  const imageName = sanitizeText(body.imageName, 240);

  if (!input && !imageDataUrl) {
    return { ok: false, error: "Provide a text input or an image to search with." };
  }

  if (imageDataUrl && !imageDataUrl.startsWith("data:image/")) {
    return { ok: false, error: "Uploaded image must be a supported image data URL." };
  }

  return {
    ok: true,
    data: {
      messages,
      input,
      imageDataUrl: imageDataUrl || undefined,
      imageName: imageName || undefined,
    },
  };
}
