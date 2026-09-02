import type { Product, Gemstone, MetalFinish } from "./types";

const swatchGradient = (metal: MetalFinish) => {
  switch (metal) {
    case "gold":
      return "linear-gradient(135deg, #E8D9B8 0%, #C9A66B 50%, #A88A4D 100%)";
    case "rose-gold":
      return "linear-gradient(135deg, #F4D4C4 0%, #E0B8A8 50%, #B8866F 100%)";
    case "silver":
      return "linear-gradient(135deg, #F0F0F0 0%, #D5D5D5 50%, #A8A8A8 100%)";
  }
};

// Use elegant SVG data URIs as placeholders for product images so the site renders without external assets.
const svgImage = (label: string, metal: MetalFinish, kind: string) => {
  const gradient = swatchGradient(metal);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23F7F3EB'/><stop offset='1' stop-color='%23EFE7D8'/></linearGradient><linearGradient id='m' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${metal === "gold" ? "%23E8D9B8" : metal === "rose-gold" ? "%23F4D4C4" : "%23F0F0F0"}'/><stop offset='1' stop-color='${metal === "gold" ? "%23A88A4D" : metal === "rose-gold" ? "%23B8866F" : "%23A8A8A8"}'/></linearGradient></defs><rect width='600' height='750' fill='url(%23g)'/><circle cx='300' cy='320' r='110' fill='url(%23m)' opacity='0.85'/><circle cx='300' cy='320' r='60' fill='%23F7F3EB'/><text x='300' y='450' font-family='Cormorant Garamond, serif' font-size='34' fill='%231D2A44' text-anchor='middle' font-style='italic'>${label}</text><text x='300' y='490' font-family='Inter, sans-serif' font-size='14' fill='%231D2A44' text-anchor='middle' letter-spacing='4' opacity='0.6'>${kind.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/\n/g, "")}`;
};

export const CATEGORIES = [
  { id: "necklaces", name: "Necklaces", nameAr: "القلائد", image: svgImage("Necklace", "gold", "necklace") },
  { id: "bracelets", name: "Bracelets", nameAr: "الأساور", image: svgImage("Bracelet", "rose-gold", "bracelet") },
  { id: "rings", name: "Rings", nameAr: "الخواتم", image: svgImage("Ring", "gold", "ring") },
  { id: "earrings", name: "Earrings", nameAr: "الأقراط", image: svgImage("Earrings", "silver", "earrings") },
  { id: "anklets", name: "Anklets", nameAr: "الخلاخيل", image: svgImage("Anklet", "gold", "anklet") },
  { id: "initial-charm", name: "Initials & Charms", nameAr: "الحروف الأولى", image: svgImage("Initials", "rose-gold", "initial") },
] as const;

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Engagement",
  "Wedding",
  "Mother's Day",
  "Valentine's Day",
  "Eid",
  "Ramadan",
  "Just Because",
];

export const GEMSTONES: { id: Gemstone; name: string; hex: string; birthMonth: string }[] = [
  { id: "diamond", name: "Diamond", hex: "#F0F0F0", birthMonth: "April" },
  { id: "sapphire", name: "Sapphire", hex: "#1E3A8A", birthMonth: "September" },
  { id: "ruby", name: "Ruby", hex: "#B91C1C", birthMonth: "July" },
  { id: "emerald", name: "Emerald", hex: "#047857", birthMonth: "May" },
  { id: "amethyst", name: "Amethyst", hex: "#7C3AED", birthMonth: "February" },
  { id: "pearl", name: "Pearl", hex: "#F5F5DC", birthMonth: "June" },
  { id: "garnet", name: "Garnet", hex: "#991B1B", birthMonth: "January" },
  { id: "topaz", name: "Topaz", hex: "#F59E0B", birthMonth: "November" },
  { id: "aquamarine", name: "Aquamarine", hex: "#7DD3FC", birthMonth: "March" },
  { id: "opal", name: "Opal", hex: "#FBCFE8", birthMonth: "October" },
  { id: "turquoise", name: "Turquoise", hex: "#14B8A6", birthMonth: "December" },
];

const metals: MetalFinish[] = ["gold", "rose-gold", "silver"];

const makeVariants = (base: number) =>
  metals.map((metal) => ({
    id: `${metal}`,
    metal,
    price: base + (metal === "rose-gold" ? 15 : metal === "silver" ? -25 : 0),
    inStock: true,
  }));

const makeLengthVariants = (base: number, lengths: number[]) =>
  metals.flatMap((metal) =>
    lengths.map((l) => ({
      id: `${metal}-${l}`,
      metal,
      lengthCm: l,
      price: base + (metal === "rose-gold" ? 15 : metal === "silver" ? -25 : 0),
      inStock: true,
    }))
  );

export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "celeste-initial-pendant",
    name: "Celeste Initial Pendant",
    nameAr: "قلادة سيليست بالحرف الأول",
    description:
      "A whisper of gold, a letter that means everything. The Celeste Initial Pendant is hand-finished in 18K gold vermeil with a delicate chain you can layer or wear alone.",
    category: "necklaces",
    basePrice: 189,
    currency: "USD",
    images: [svgImage("Celeste", "gold", "18K GOLD")],
    badge: "bestseller",
    rating: 4.9,
    reviewCount: 312,
    variants: makeLengthVariants(189, [40, 45, 50]),
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      gemstone: true,
      length: { options: [40, 45, 50], default: 45 },
    },
    materials: ["18K Gold Vermeil", "Sterling Silver Core"],
    careInstructions: "Avoid contact with perfumes and lotions. Store in the pouch provided.",
    isHypoallergenic: true,
    tags: ["initial", "engravable", "18K", "layering"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
  },
  {
    id: "p-002",
    slug: "noor-birthstone-necklace",
    name: "Noor Birthstone Necklace",
    nameAr: "قلادة نور بحجر الميلاد",
    description:
      "Catch the light of her birth month. The Noor Necklace pairs a hand-set gemstone with a fine cable chain, finished in 18K gold for a piece she will reach for daily.",
    category: "necklaces",
    basePrice: 229,
    currency: "USD",
    images: [svgImage("Noor", "gold", "BIRTHSTONE")],
    badge: "new",
    rating: 4.8,
    reviewCount: 184,
    variants: makeLengthVariants(229, [40, 45, 50]),
    personalization: {
      gemstone: true,
      engraving: { maxLength: 12, placeholder: "Engrave a name" },
      length: { options: [40, 45, 50], default: 45 },
    },
    materials: ["18K Gold", "Natural Gemstone"],
    careInstructions: "Remove before showering. Wipe gently with the included polishing cloth.",
    isHypoallergenic: true,
    isHalalFriendly: true,
    tags: ["birthstone", "engravable", "18K"],
    occasion: ["Birthday", "Mother's Day"],
  },
  {
    id: "p-003",
    slug: "lumi-name-chain",
    name: "Lumi Name Chain",
    nameAr: "سلسلة لومي بالاسم",
    description:
      "Her name, hand-set in 925 sterling silver. Choose a script or block letter style — made to order, just for her.",
    category: "necklaces",
    basePrice: 159,
    currency: "USD",
    images: [svgImage("Lumi", "silver", "STERLING SILVER")],
    rating: 4.9,
    reviewCount: 421,
    variants: makeLengthVariants(159, [40, 45, 50, 55]),
    personalization: {
      engraving: { maxLength: 10, placeholder: "Her name" },
      length: { options: [40, 45, 50, 55], default: 45 },
    },
    materials: ["925 Sterling Silver"],
    careInstructions: "Polish with a soft cloth. Avoid water and harsh chemicals.",
    isHypoallergenic: true,
    tags: ["name", "engravable", "silver"],
    occasion: ["Anniversary", "Just Because"],
  },
  {
    id: "p-004",
    slug: "rosa-charm-bracelet",
    name: "Rosa Charm Bracelet",
    nameAr: "سوار روزا بالقلائد",
    description:
      "Mix, match, make it yours. The Rosa Charm Bracelet is the start of a story — add initials, birthstones and tiny talismans, one for every chapter.",
    category: "bracelets",
    basePrice: 119,
    currency: "USD",
    images: [svgImage("Rosa", "rose-gold", "CHARMS")],
    badge: "bestseller",
    rating: 4.8,
    reviewCount: 567,
    variants: makeLengthVariants(119, [16, 18, 20]),
    personalization: {
      charm: true,
      engraving: { maxLength: 8, placeholder: "Add a word" },
      length: { options: [16, 18, 20], default: 18 },
    },
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Store dry. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["charm", "engravable", "stackable"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
  },
  {
    id: "p-005",
    slug: "safa-signet-ring",
    name: "Safa Signet Ring",
    nameAr: "خاتم صفا سيغنت",
    description:
      "An heirloom in the making. The Safa Signet is engraved with her initial and finished in 18K gold — a piece to pass down.",
    category: "rings",
    basePrice: 269,
    currency: "USD",
    images: [svgImage("Safa", "gold", "18K SIGNET")],
    badge: "limited",
    rating: 5.0,
    reviewCount: 92,
    variants: [
      { id: "gold-6", metal: "gold", size: "6", price: 269, inStock: true },
      { id: "gold-7", metal: "gold", size: "7", price: 269, inStock: true },
      { id: "gold-8", metal: "gold", size: "8", price: 269, inStock: true },
      { id: "silver-6", metal: "silver", size: "6", price: 219, inStock: true },
      { id: "silver-7", metal: "silver", size: "7", price: 219, inStock: true },
      { id: "silver-8", metal: "silver", size: "8", price: 219, inStock: false, madeToOrder: true, productionDays: "10–14 days" },
    ],
    personalization: {
      engraving: { maxLength: 2, placeholder: "AB" },
    },
    materials: ["18K Gold", "Solid Sterling Silver"],
    careInstructions: "Remove before sleep and exercise.",
    isHalalFriendly: true,
    isHypoallergenic: true,
    tags: ["signet", "engravable", "18K", "heirloom"],
    occasion: ["Engagement", "Anniversary", "Birthday"],
  },
  {
    id: "p-006",
    slug: "amara-hoops",
    name: "Amara Pearl Hoops",
    nameAr: "أقراط أمارا باللؤلؤ",
    description:
      "Freshwater pearls cradled in 18K gold. The Amara Hoops catch the light from every angle — refined, modern, made for her.",
    category: "earrings",
    basePrice: 199,
    currency: "USD",
    images: [svgImage("Amara", "gold", "PEARL HOOPS")],
    badge: "new",
    rating: 4.9,
    reviewCount: 138,
    variants: makeVariants(199),
    materials: ["18K Gold", "Freshwater Pearl"],
    careInstructions: "Keep away from moisture. Wipe with a soft cloth after wear.",
    isHypoallergenic: true,
    tags: ["pearl", "18K", "hoops"],
    occasion: ["Wedding", "Anniversary", "Just Because"],
  },
  {
    id: "p-007",
    slug: "yasmin-anklet",
    name: "Yasmin Initial Anklet",
    nameAr: "خلخال ياسمين بالحرف الأول",
    description:
      "A tiny initial resting at her ankle. Lightweight, tarnish-resistant, and finished by hand in 18K gold.",
    category: "anklets",
    basePrice: 109,
    currency: "USD",
    images: [svgImage("Yasmin", "gold", "ANKLET")],
    rating: 4.7,
    reviewCount: 76,
    variants: makeLengthVariants(109, [22, 24, 26]),
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      length: { options: [22, 24, 26], default: 24 },
    },
    materials: ["18K Gold Vermeil"],
    careInstructions: "Avoid contact with water and lotions.",
    isHypoallergenic: true,
    tags: ["initial", "anklet", "18K"],
    occasion: ["Birthday", "Just Because"],
  },
  {
    id: "p-008",
    slug: "reem-tennis-bracelet",
    name: "Reem Tennis Bracelet",
    nameAr: "سوار ريم تنس",
    description:
      "A line of light, hand-set in 925 sterling silver. The Reem Tennis Bracelet is the everyday piece that makes any outfit feel finished.",
    category: "bracelets",
    basePrice: 249,
    currency: "USD",
    images: [svgImage("Reem", "silver", "TENNIS")],
    rating: 4.8,
    reviewCount: 89,
    variants: makeLengthVariants(249, [16, 18, 20]),
    personalization: {
      length: { options: [16, 18, 20], default: 18 },
    },
    materials: ["925 Sterling Silver", "Cubic Zirconia"],
    careInstructions: "Remove before showering and sleeping.",
    isHypoallergenic: true,
    tags: ["tennis", "silver", "everyday"],
    occasion: ["Wedding", "Anniversary"],
  },
  {
    id: "p-009",
    slug: "layla-charm-set",
    name: "Layla Charm Set",
    nameAr: "طقم ليلى بالقلائد",
    description:
      "Three charms, one story. The Layla Charm Set comes with a heart, an initial and a birthstone — designed to layer with our Rosa Bracelet.",
    category: "initial-charm",
    basePrice: 79,
    currency: "USD",
    images: [svgImage("Layla", "rose-gold", "CHARM SET")],
    badge: "sale",
    compareAtPrice: 99,
    rating: 4.8,
    reviewCount: 234,
    variants: makeVariants(79),
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      charm: true,
    },
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Store dry in original pouch.",
    isHypoallergenic: true,
    tags: ["charm", "engravable", "set"],
    occasion: ["Birthday", "Just Because"],
  },
  {
    id: "p-010",
    slug: "hind-statement-earrings",
    name: "Hind Statement Earrings",
    nameAr: "أقراط هند الفاخرة",
    description:
      "Hand-set with a constellation of pavé stones. The Hind Earrings move like light, made to be noticed.",
    category: "earrings",
    basePrice: 219,
    currency: "USD",
    images: [svgImage("Hind", "silver", "STATEMENT")],
    badge: "new",
    rating: 4.7,
    reviewCount: 51,
    variants: makeVariants(219),
    materials: ["925 Sterling Silver", "Pavé CZ"],
    careInstructions: "Keep dry. Store flat.",
    isHypoallergenic: true,
    tags: ["statement", "silver", "occasion"],
    occasion: ["Wedding", "Eid"],
  },
  {
    id: "p-011",
    slug: "dana-heart-pendant",
    name: "Dana Heart Pendant",
    nameAr: "قلادة دانا القلب",
    description:
      "A small heart, finely engraved. The Dana Pendant is a love letter in metal — keep her name close to yours.",
    category: "necklaces",
    basePrice: 149,
    currency: "USD",
    images: [svgImage("Dana", "rose-gold", "HEART")],
    rating: 4.9,
    reviewCount: 198,
    variants: makeLengthVariants(149, [40, 45, 50]),
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a message" },
      length: { options: [40, 45, 50], default: 45 },
    },
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Avoid water. Polish gently.",
    isHypoallergenic: true,
    tags: ["heart", "engravable", "gift"],
    occasion: ["Valentine's Day", "Anniversary"],
  },
  {
    id: "p-012",
    slug: "amal-stacking-rings",
    name: "Amal Stacking Rings",
    nameAr: "خواتم أمل للتراكم",
    description:
      "A trio of fine bands, made to wear together. Hand-finished in 18K gold with the option to engrave a single letter on each.",
    category: "rings",
    basePrice: 189,
    currency: "USD",
    images: [svgImage("Amal", "gold", "STACKING")],
    rating: 4.8,
    reviewCount: 67,
    variants: [
      { id: "gold-5", metal: "gold", size: "5", price: 189, inStock: true },
      { id: "gold-6", metal: "gold", size: "6", price: 189, inStock: true },
      { id: "gold-7", metal: "gold", size: "7", price: 189, inStock: true },
      { id: "gold-8", metal: "gold", size: "8", price: 189, inStock: true },
    ],
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
    },
    materials: ["18K Gold Vermeil"],
    careInstructions: "Remove before washing hands.",
    isHypoallergenic: true,
    tags: ["stacking", "engravable", "18K"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
  },
];

export const FEATURED_COLLECTIONS = [
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Just landed, just made for you",
    productIds: ["p-002", "p-006", "p-010", "p-011"],
  },
  {
    id: "best-sellers",
    title: "Best Sellers",
    subtitle: "Loved by women across the Gulf",
    productIds: ["p-001", "p-004", "p-005", "p-009"],
  },
  {
    id: "engravable",
    title: "Made to be Engraved",
    subtitle: "Add her name, her story",
    productIds: ["p-001", "p-002", "p-003", "p-005", "p-007", "p-011"],
  },
];

export const TESTIMONIALS = [
  {
    name: "Layla A.",
    location: "Dubai, UAE",
    rating: 5,
    text: "The Celeste Pendant with my daughter's initial is the most thoughtful gift I've ever given. The engraving is flawless.",
    product: "Celeste Initial Pendant",
  },
  {
    name: "Reem S.",
    location: "Riyadh, KSA",
    rating: 5,
    text: "Ordered the birthstone necklace for my mother's birthday. She cried. Beautiful packaging, fast delivery to Saudi.",
    product: "Noor Birthstone Necklace",
  },
  {
    name: "Maryam K.",
    location: "Doha, Qatar",
    rating: 5,
    text: "I've never worn jewellery this personal. The customizer is so easy — I designed something just for me.",
    product: "Rosa Charm Bracelet",
  },
  {
    name: "Hessa B.",
    location: "Manama, Bahrain",
    rating: 5,
    text: "The signet ring is an heirloom. Engraved with my grandmother's initial — I wear it every day.",
    product: "Safa Signet Ring",
  },
];

export const TRUST_BADGES = [
  { title: "Hand-finished", description: "Each piece set and polished by hand in our atelier." },
  { title: "18K & 925 Hallmarked", description: "Authentic, certified metals — purity you can trust." },
  { title: "Hypoallergenic", description: "Nickel-free, kind to sensitive skin." },
  { title: "Free Gulf Shipping", description: "Complimentary delivery across all six GCC countries." },
  { title: "30-day Returns", description: "Generous, no-questions-asked exchange policy." },
  { title: "Made-to-order", description: "Handcrafted in 5–7 days, just for her." },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategoryProducts(categoryId: string) {
  return PRODUCTS.filter((p) => p.category === categoryId);
}

export const CHARMS = [
  { id: "heart", name: "Heart Charm", price: 25, symbol: "♥" },
  { id: "moon", name: "Moon Charm", price: 25, symbol: "☾" },
  { id: "star", name: "Star Charm", price: 20, symbol: "★" },
  { id: "flower", name: "Flower Charm", price: 22, symbol: "✿" },
  { id: "pearl", name: "Pearl Drop", price: 28, symbol: "❀" },
  { id: "initial", name: "Initial Charm", price: 24, symbol: "A" },
];

export const ENGRAVING_FONTS = [
  { id: "classic", name: "Classic Serif", sample: "Aa" },
  { id: "script", name: "Handwritten", sample: "Aa" },
  { id: "block", name: "Modern Block", sample: "Aa" },
];