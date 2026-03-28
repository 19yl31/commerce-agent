import { catalog } from "@/data/catalog";
import type { ChatRequest, ChatResponse } from "@/lib/chat-contract";
import { rankProducts, summarizeCatalog } from "@/lib/search";

const OPENAI_MODEL = "gpt-4.1-nano";

function buildCatalogPrompt() {
  return JSON.stringify(summarizeCatalog(), null, 2);
}

function buildRecommendationPool(
  request: ChatRequest,
  recommendationIds: string[],
  imageSummary?: string,
) {
  const primary = recommendationIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter((product): product is (typeof catalog)[number] => Boolean(product));

  const backup = (
    request.imageDataUrl
      ? rankProducts([request.input, imageSummary].filter(Boolean).join(" "), 4)
      : rankProducts(request.input, 4)
  ).filter((product) => !primary.some((item) => item.id === product.id));

  return [...primary, ...backup].slice(0, 4);
}

async function callOpenAI(request: ChatRequest, imageSummary?: string) {
  const apiKey =
    process.env.OPENAI_API_KEY ?? process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  const catalogContext = buildCatalogPrompt();
  const recentMessages = request.messages.slice(-6);
  const userContent: Array<
    | { type: "input_text"; text: string }
    | { type: "input_image"; image_url: string }
  > = [{ type: "input_text", text: request.input }];

  if (request.imageDataUrl) {
    userContent.push({
      type: "input_image",
      image_url: request.imageDataUrl,
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are Muse, a warm and stylish shopping assistant for Avenoir. You should sound like a normal helpful AI, not a scripted support bot. Handle everyday conversation, text product recommendation, and image-based product search in one assistant. Keep the tone natural, brief, and personable. If the user greets you, greet them back normally. If they make small talk, respond like a real assistant before steering back to shopping only when useful. Only explain your capabilities when they ask or when it clearly helps. You must only recommend products from the provided catalog. If the catalog does not contain a good match, say that clearly. When the user asks for shopping help, give a concise recommendation with a short reason, and ask a follow-up question if their request is too broad. Return JSON matching the requested schema.",
            },
          ],
        },
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `Catalog:\n${catalogContext}`,
            },
          ],
        },
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: imageSummary
                ? `Precomputed image summary: ${imageSummary}`
                : "No image summary was precomputed.",
            },
          ],
        },
        ...recentMessages.map((message) => ({
          role: message.role,
          content: [
            {
              type: message.role === "assistant" ? "output_text" : "input_text",
              text: message.content,
            },
          ],
        })),
        {
          role: "user",
          content: userContent,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "commerce_agent_response",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              mode: {
                type: "string",
                enum: ["general", "text_recommendation", "image_search"],
              },
              answer: { type: "string" },
              recommendationIds: {
                type: "array",
                items: { type: "string" },
              },
              imageSummary: { type: "string" },
            },
            required: ["mode", "answer", "recommendationIds", "imageSummary"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenAI request failed with status ${response.status}: ${errorText}`,
    );
  }

  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  const structuredText =
    payload.output_text ??
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text" && item.text)
      ?.text;

  if (!structuredText) {
    throw new Error(`OpenAI response did not include structured output: ${JSON.stringify(payload)}`);
  }

  return JSON.parse(structuredText) as {
    mode: ChatResponse["mode"];
    answer: string;
    recommendationIds: string[];
    imageSummary?: string;
  };
}

async function summarizeImage(request: ChatRequest) {
  const apiKey =
    process.env.OPENAI_API_KEY ?? process.env.REACT_APP_OPENAI_API_KEY;

  if (!request.imageDataUrl || !apiKey) {
    return request.imageName
      ? `Uploaded image filename: ${request.imageName}. Use it as a weak clue only.`
      : undefined;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Describe the clothing or product in this image in one sentence focused on category, color, style, material cues, and activity use.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: request.input || "Find similar products in the catalog.",
            },
            {
              type: "input_image",
              image_url: request.imageDataUrl,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image summary failed with status ${response.status}: ${errorText}`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };

  return payload.output_text?.trim();
}

export async function runCommerceAgent(request: ChatRequest): Promise<ChatResponse> {
  const imageSummary = await summarizeImage(request);

  const result = await callOpenAI(request, imageSummary);
  const recommendations = buildRecommendationPool(
    request,
    result.recommendationIds,
    imageSummary,
  );

  return {
    mode: result.mode,
    answer: result.answer,
    recommendations,
    imageSummary: result.imageSummary ?? imageSummary,
    usedModel: true,
    runtime: "openai",
  };
}
