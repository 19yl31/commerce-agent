"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CommerceAgent } from "@/components/commerce-agent";
import { HeroActions } from "@/components/hero-actions";
import { catalog } from "@/data/catalog";

const categories = [
  {
    id: "performance",
    name: "Performance wear",
    description: "Breathable staples for training, running, and movement.",
    tags: ["sport", "gym", "running", "training", "yoga"],
  },
  {
    id: "everyday",
    name: "Everyday layers",
    description: "Comfort-first pieces for commute days and casual dressing.",
    tags: ["casual", "hoodie", "shirt", "streetwear", "walking"],
  },
  {
    id: "travel",
    name: "Travel essentials",
    description: "Packable outerwear, walkable shoes, and versatile carry pieces.",
    tags: ["travel", "jacket", "bag", "walking", "packable"],
  },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickFeaturedProducts() {
  return shuffle(catalog).slice(0, 4);
}

function pickCategoryProducts(categoryId: string | null) {
  if (!categoryId) {
    return shuffle(catalog).slice(0, 4);
  }

  const category = categories.find((item) => item.id === categoryId);
  if (!category) {
    return shuffle(catalog).slice(0, 4);
  }

  const matches = catalog.filter((product) =>
    category.tags.some(
      (tag) =>
        product.tags.includes(tag) ||
        product.attributes.some((attribute) => attribute.includes(tag)) ||
        product.description.toLowerCase().includes(tag),
    ),
  );

  return shuffle(matches.length > 0 ? matches : catalog).slice(0, 4);
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState(() => catalog.slice(0, 4));
  const [recommendedProducts, setRecommendedProducts] = useState(() => catalog.slice(0, 4));

  useEffect(() => {
    setFeaturedProducts(pickFeaturedProducts());
    setRecommendedProducts(pickCategoryProducts(null));
  }, []);

  useEffect(() => {
    setRecommendedProducts(pickCategoryProducts(activeCategory));
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,196,150,0.58),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(149,63,72,0.3),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,232,214,0.46),_transparent_24%),linear-gradient(180deg,_#fff4eb_0%,_#f2d1c4_34%,_#e2b7b0_62%,_#f6ebe4_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[40px] border border-white/50 bg-[linear-gradient(135deg,rgba(255,248,243,0.88),rgba(255,238,227,0.62))] shadow-[0_30px_90px_rgba(72,32,26,0.1)] backdrop-blur">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="flex flex-col justify-center">
              <div className="relative pt-2">
                <p
                  className="text-[2.4rem] leading-none text-[#9a5f49] sm:text-[2.8rem]"
                  style={{
                    fontFamily: '"Imperial Script", "Segoe Script", "Brush Script MT", cursive',
                  }}
                >
                  Avenoir
                </p>
                <h1 className="mt-20 max-w-md font-[var(--font-prata)] text-[3.5rem] leading-[0.96] tracking-[-0.02em] text-[#241a14] sm:mt-24 sm:text-[4.5rem] lg:text-[5.4rem]">
                  Dress
                  <br />
                  the
                  <br />
                  mood.
                </h1>
                <p className="mt-8 max-w-lg text-[0.98rem] leading-7 text-[#5f534b] sm:text-[1.02rem]">
                  Elevated essentials with a softer point of view: sharp outerwear,
                  easy knitwear, and refined staples selected to wear well across
                  seasons.
                </p>
              </div>

              <HeroActions />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProducts.map((product, index) => (
                <article
                  key={product.id}
                  className={`group cursor-pointer rounded-[32px] border p-4 shadow-[0_18px_44px_rgba(35,24,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_rgba(72,32,26,0.14)] ${
                    index === 0 || index === 3
                      ? "border-[#3f201d] bg-[linear-gradient(180deg,#3b1f1d_0%,#241614_100%)] text-white"
                      : "border-white/80 bg-white/88"
                  }`}
                >
                  <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,245,237,0.92),rgba(249,227,214,0.78))]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={320}
                      height={320}
                      className="h-[180px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`text-sm ${
                          index === 0 || index === 3 ? "text-white/60" : "text-[#7b6a5d]"
                        }`}
                      >
                        {product.category}
                      </p>
                      <h2 className="mt-1 font-[var(--font-prata)] text-[1.48rem] leading-[1.02] tracking-[-0.01em]">
                        {product.name}
                      </h2>
                    </div>
                    <span className="text-sm font-semibold">${product.price}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        index === 0 || index === 3 ? "text-white/65" : "text-[#7b6a5d]"
                      }`}
                    >
                      Hover to explore
                    </span>
                    <span
                      className={`text-lg transition duration-300 group-hover:translate-x-1 ${
                        index === 0 || index === 3 ? "text-white/75" : "text-[#9a5f49]"
                      }`}
                    >
                      →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {categories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory((current) => (current === category.id ? null : category.id))}
                className={`rounded-[32px] border p-6 text-left shadow-[0_14px_44px_rgba(72,32,26,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(72,32,26,0.1)] ${
                  isActive
                    ? "border-[#c9785a] bg-[linear-gradient(180deg,rgba(255,244,237,0.95),rgba(255,232,220,0.92))]"
                    : "border-white/60 bg-[linear-gradient(180deg,rgba(255,251,247,0.82),rgba(255,240,232,0.72))]"
                }`}
              >
                <h3 className="font-[var(--font-prata)] text-[1.85rem] leading-[1.02] tracking-[-0.01em] text-[#241a14]">
                  {category.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#5f534b]">{category.description}</p>
                <div className="mt-5 flex items-center justify-between text-sm text-[#9a5f49]">
                  <span>{isActive ? "Showing matching picks" : "Shop this edit"}</span>
                  <span className={`transition ${isActive ? "translate-x-1" : ""}`}>→</span>
                </div>
              </button>
            );
          })}
        </section>

        <section
          id="catalog"
          className="rounded-[36px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,250,246,0.92),rgba(251,242,236,0.88))] p-6 shadow-[0_18px_60px_rgba(72,32,26,0.08)]"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a5f49]">
                Curated for you
              </p>
              <h2 className="mt-2 font-[var(--font-prata)] text-[2.45rem] leading-[1.02] tracking-[-0.01em] text-[#241a14]">
                You may like
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f534b]">
                {activeCategory
                  ? `Showing picks inspired by ${
                      categories.find((item) => item.id === activeCategory)?.name ?? "your selection"
                    }.`
                  : "A fresh edit from the current collection."}
              </p>
            </div>
            <p className="text-sm text-[#7b6a5d]">
              {activeCategory ? "Filtered edit" : "Refresh for a new edit"}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendedProducts.map((product) => (
              <article
                key={product.id}
                className="group cursor-pointer rounded-[28px] border border-[#ead8cf] bg-[linear-gradient(180deg,#fffaf6_0%,#fbf4ee_100%)] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_46px_rgba(72,32,26,0.1)]"
              >
                <div className="overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#f8eee7_0%,#f2e2d7_100%)]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={240}
                    height={240}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-[var(--font-prata)] text-[1.45rem] leading-[1.02] tracking-[-0.01em] text-[#241a14]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.category} · {product.color}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#241a14]">${product.price}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f534b]">{product.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <CommerceAgent />
    </main>
  );
}
