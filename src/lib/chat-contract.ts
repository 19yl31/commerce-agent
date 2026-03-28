export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  input: string;
  imageDataUrl?: string;
  imageName?: string;
};

export type ChatMode = "general" | "text_recommendation" | "image_search";

export type ChatResponse = {
  mode: ChatMode;
  answer: string;
  recommendations: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    color: string;
    audience: string;
    image: string;
    description: string;
    tags: string[];
    attributes: string[];
  }>;
  imageSummary?: string;
  usedModel: boolean;
  runtime: "openai" | "local";
};

export type ChatErrorResponse = {
  error: string;
};

export const CHAT_LIMITS = {
  maxMessages: 12,
  maxMessageLength: 1200,
  maxInputLength: 1200,
  maxImageDataUrlLength: 6_000_000,
} as const;
