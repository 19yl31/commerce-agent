export type Product = {
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
};

export const catalog: Product[] = [
  {
    id: "trailflex-tee",
    name: "TrailFlex Performance Tee",
    category: "tops",
    price: 48,
    color: "cobalt blue",
    audience: "unisex",
    image: "/products/trailflex-tee.svg",
    description:
      "A breathable training t-shirt with sweat-wicking knit, quick-dry finish, and a soft athletic drape.",
    tags: ["sport", "gym", "running", "lightweight", "breathable", "blue"],
    attributes: ["crew neck", "moisture wicking", "stretch", "daily training"],
  },
  {
    id: "cityloop-hoodie",
    name: "CityLoop Everyday Hoodie",
    category: "outerwear",
    price: 82,
    color: "stone",
    audience: "unisex",
    image: "/products/cityloop-hoodie.svg",
    description:
      "A relaxed hoodie built for commute days and chilly evenings with brushed interior comfort.",
    tags: ["casual", "hoodie", "soft", "streetwear", "neutral"],
    attributes: ["oversized fit", "fleece lining", "kangaroo pocket"],
  },
  {
    id: "stridecore-shorts",
    name: "StrideCore 7in Training Shorts",
    category: "bottoms",
    price: 54,
    color: "graphite",
    audience: "men",
    image: "/products/stridecore-shorts.svg",
    description:
      "Training shorts designed for cardio and gym sessions with a secure phone pocket and four-way stretch.",
    tags: ["sport", "shorts", "gym", "running", "black", "mens"],
    attributes: ["7 inch inseam", "zip pocket", "four-way stretch"],
  },
  {
    id: "aerial-flow-leggings",
    name: "Aerial Flow Leggings",
    category: "bottoms",
    price: 76,
    color: "forest green",
    audience: "women",
    image: "/products/aerial-flow-leggings.svg",
    description:
      "High-rise leggings with sculpting support for yoga, pilates, and low-impact studio training.",
    tags: ["yoga", "leggings", "studio", "green", "womens", "soft"],
    attributes: ["high rise", "sculpting", "smooth handfeel"],
  },
  {
    id: "harbor-knit-shirt",
    name: "Harbor Knit Camp Shirt",
    category: "tops",
    price: 64,
    color: "sand",
    audience: "men",
    image: "/products/harbor-knit-shirt.svg",
    description:
      "A textured short-sleeve camp shirt for summer dinners, vacations, and smart casual looks.",
    tags: ["casual", "shirt", "summer", "beige", "mens", "button up"],
    attributes: ["textured knit", "relaxed collar", "vacation style"],
  },
  {
    id: "nova-shell-jacket",
    name: "Nova Shell Rain Jacket",
    category: "outerwear",
    price: 118,
    color: "sunset orange",
    audience: "women",
    image: "/products/nova-shell-jacket.svg",
    description:
      "A lightweight weather shell with water-resistant protection for travel and changeable forecasts.",
    tags: ["jacket", "rain", "orange", "travel", "womens", "lightweight"],
    attributes: ["packable", "water resistant", "drawcord hem"],
  },
  {
    id: "metro-carry-sneaker",
    name: "MetroCarry Knit Sneaker",
    category: "shoes",
    price: 96,
    color: "off white",
    audience: "unisex",
    image: "/products/metro-carry-sneaker.svg",
    description:
      "A clean everyday sneaker with supportive foam and a knit upper that works for travel and city walking.",
    tags: ["shoes", "sneaker", "casual", "walking", "white", "unisex"],
    attributes: ["foam sole", "knit upper", "travel ready"],
  },
  {
    id: "summit-utility-tote",
    name: "Summit Utility Tote",
    category: "accessories",
    price: 58,
    color: "olive",
    audience: "unisex",
    image: "/products/summit-utility-tote.svg",
    description:
      "A structured carryall with room for a laptop, gym shoes, and daily essentials.",
    tags: ["bag", "tote", "commute", "gym", "green", "utility"],
    attributes: ["laptop sleeve", "zip top", "reinforced straps"],
  },
];
