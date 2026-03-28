import { catalog, type Product } from "@/data/catalog";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "for",
  "the",
  "to",
  "with",
  "i",
  "me",
  "my",
  "show",
  "find",
  "want",
  "need",
  "recommend",
  "something",
]);

export type RankedProduct = Product & {
  score: number;
  reasons: string[];
};

export function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token));
}

export function rankProducts(query: string, limit = 4): RankedProduct[] {
  const tokens = tokenize(query);

  const ranked = catalog
    .map((product) => {
      let score = 0;
      const reasons = new Set<string>();
      const haystack = [
        product.name,
        product.category,
        product.color,
        product.audience,
        product.description,
        ...product.tags,
        ...product.attributes,
      ]
        .join(" ")
        .toLowerCase();

      for (const token of tokens) {
        if (product.name.toLowerCase().includes(token)) {
          score += 5;
          reasons.add(`Matches "${token}" in the product name`);
        }
        if (product.category.toLowerCase().includes(token)) {
          score += 4;
          reasons.add(`Fits the ${product.category} category`);
        }
        if (product.color.toLowerCase().includes(token)) {
          score += 4;
          reasons.add(`Aligns with the ${product.color} color request`);
        }
        if (product.audience.toLowerCase().includes(token)) {
          score += 3;
          reasons.add(`Targets the ${product.audience} audience`);
        }
        if (product.tags.some((tag) => tag.includes(token))) {
          score += 4;
          reasons.add(`Matches the ${token} use case`);
        }
        if (product.attributes.some((attribute) => attribute.includes(token))) {
          score += 3;
          reasons.add(`Has a ${token}-related feature`);
        }
        if (haystack.includes(token)) {
          score += 1;
        }
      }

      if (tokens.length === 0) {
        score = 1;
        reasons.add("A general-purpose catalog pick");
      }

      return {
        ...product,
        score,
        reasons: Array.from(reasons),
      };
    })
    .filter((product) => product.score > 0)
    .sort((left, right) => right.score - left.score || left.price - right.price)
    .slice(0, limit);

  return ranked.length > 0 ? ranked : fallbackProducts(limit);
}

export function fallbackProducts(limit = 4): RankedProduct[] {
  return catalog.slice(0, limit).map((product) => ({
    ...product,
    score: 1,
    reasons: ["Popular all-rounder from the current catalog"],
  }));
}

export function summarizeCatalog() {
  return catalog.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    color: product.color,
    audience: product.audience,
    description: product.description,
    tags: product.tags,
    attributes: product.attributes,
  }));
}

export function looksLikeRecommendationRequest(input: string) {
  const normalized = input.toLowerCase();
  return [
    "recommend",
    "looking for",
    "find me",
    "show me",
    "best",
    "shirt",
    "jacket",
    "hoodie",
    "shorts",
    "leggings",
    "sneaker",
    "bag",
  ].some((phrase) => normalized.includes(phrase));
}
