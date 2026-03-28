# Avenoir Commerce Agent

A take-home implementation of a single AI shopping agent for a commerce website.

This project is designed around one assistant, `Muse`, that handles all three required use cases in the same experience:

- General conversation
- Text-based product recommendation
- Image-based product search

The storefront is presented as a small fashion brand, `Avenoir`, with a predefined catalog. The assistant is embedded as a floating shopping panel rather than a full-page chatbot so the shopping experience stays front and center.

## What is implemented

- A storefront landing page with curated product sections
- A floating AI shopping assistant (`Muse`)
- One unified `POST /api/chat` endpoint
- General conversational responses
- Text-based product recommendations grounded to the catalog
- Image upload plus image-based catalog matching
- Recommendation panel that updates alongside the conversation

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local in-memory catalog
- OpenAI Responses API

## Architecture

The exercise specifically asks for a single agent that can handle multiple use cases. To keep that requirement explicit, the app uses one orchestration layer and one API route:

- [`src/app/api/chat/route.ts`](/C:/Users/lyhsd/Documents/New%20project/commerce-agent/src/app/api/chat/route.ts): request entry point
- [`src/lib/agent.ts`](/C:/Users/lyhsd/Documents/New%20project/commerce-agent/src/lib/agent.ts): single-agent orchestration and OpenAI call
- [`src/lib/search.ts`](/C:/Users/lyhsd/Documents/New%20project/commerce-agent/src/lib/search.ts): catalog ranking helpers
- [`src/data/catalog.ts`](/C:/Users/lyhsd/Documents/New%20project/commerce-agent/src/data/catalog.ts): predefined product catalog
- [`src/components/commerce-agent.tsx`](/C:/Users/lyhsd/Documents/New%20project/commerce-agent/src/components/commerce-agent.tsx): assistant UI

The assistant is grounded to a fixed catalog so it cannot invent products outside the store inventory. If an item is not available, it should say so and propose the closest alternatives.

## Feature coverage

### 1. General conversation

The assistant can greet the user, answer light conversational prompts, and continue into shopping assistance naturally.

Examples:

- `Hi`
- `How are you?`
- `What can you do?`

### 2. Text-based recommendation

The assistant can interpret requests such as:

- `I need a lightweight jacket for travel`
- `Recommend a t-shirt for sports`
- `I want something casual but still polished`

It responds conversationally and keeps recommendations constrained to the catalog.

### 3. Image-based product search

The user can upload an image and ask for similar items. The uploaded image appears in the conversation, and the recommendation panel updates based on the image plus the latest prompt.

## API

### `POST /api/chat`

Example request:

```json
{
  "messages": [
    { "role": "user", "content": "I need a lightweight jacket for travel" }
  ],
  "input": "I need a lightweight jacket for travel",
  "imageDataUrl": "data:image/png;base64,...",
  "imageName": "reference-look.png"
}
```

Example response:

```json
{
  "mode": "text_recommendation",
  "answer": "A few good options stand out for travel and light layering...",
  "recommendations": [
    {
      "id": "nova-shell-jacket",
      "name": "Nova Shell Rain Jacket",
      "category": "outerwear",
      "price": 118,
      "color": "sunset orange",
      "audience": "women",
      "image": "/products/nova-shell-jacket.svg",
      "description": "A lightweight weather shell with water-resistant protection for travel and changeable forecasts.",
      "tags": ["jacket", "rain", "orange", "travel", "womens", "lightweight"],
      "attributes": ["packable", "water resistant", "drawcord hem"]
    }
  ],
  "imageSummary": "",
  "usedModel": true,
  "runtime": "openai"
}
```

## Running locally

Install dependencies:

```bash
npm install
```

Start the dev server on port `3001`:

```bash
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Reviewer quick start

If you want to review the project quickly:

1. Install [Node.js](https://nodejs.org/)
2. Open a terminal in this project folder
3. Run `npm install`
4. Create a file named `.env.local`
5. Add your OpenAI API key:

```bash
OPENAI_API_KEY=your_key_here
```

6. Run `npm run dev -- --port 3001`
7. Open [http://localhost:3001](http://localhost:3001)
8. Try:
   - `Hi`
   - `I need a lightweight jacket for travel`
   - `I want something more polished`
   - Upload an image and ask `Find something similar`

## Environment variables

Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_key_here
```

This project is intended to run with a valid OpenAI API key because the final chat flow uses the model directly.

## Why this is not publicly deployed

I chose not to leave a public hosted version online because the assistant uses a live OpenAI API key. For a take-home submission, a public deployment without authentication or rate limiting would create unnecessary cost and abuse risk.

The project is ready to run locally and can be reviewed safely from source with reproducible setup instructions.

## Design decisions

- The storefront is a fashion retail concept rather than a bare chatbot page so the agent feels embedded in a realistic commerce context.
- The assistant opens as a floating panel to keep browsing primary and AI help secondary.
- The recommendation panel stays visible beside the conversation so the user can see product results update in real time.
- Product inventory is intentionally small and predefined to match the exercise requirement and keep evaluation predictable.

## Tradeoffs

- The catalog is small and synthetic, so recommendation breadth is intentionally limited.
- There is no user authentication, persistence layer, or production rate limiting.
- The current implementation is optimized for take-home clarity and demo reliability rather than full production hardening.

## Suggested demo prompts

- `Hi`
- `Recommend a hoodie for everyday wear`
- `I want something more polished`
- `I want a skirt`
- Upload an image and ask: `Find something similar`
