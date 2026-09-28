import { readFileSync } from "fs";

// Load .env manually (tsx doesn't load it automatically)
try {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // fall through to process env
}

import { db, schema } from "./index";
import { products, productVariants, promoCodes } from "./schema";
import { inArray } from "drizzle-orm";

// IMPORTANT: only ever delete these explicit IDs (the old demo entries plus
// the real products managed by this seed). Never blanket-delete the table —
// that would destroy live catalogue data again.
const SEED_PRODUCT_IDS = [
  "p-001", "p-002", "p-003", "p-004", "p-005", "p-006",
  "p-007", "p-008", "p-009", "p-010", "p-011", "p-012",
  "real-001", "real-002", "real-003", "real-004", "real-005",
  "real-006", "real-007", "real-008", "real-009", "real-010", "real-011",
];

// Real products recovered from order history (2026-09). Prices and variants
// reflect what was actually sold. Descriptions follow the gold plated
// positioning — no solid-gold or silver-purity claims anywhere.
const PRODUCTS_SEED = [
  {
    id: "real-001",
    slug: "qalb",
    name: "Qalb",
    nameAr: "قلب",
    description:
      "Qalb — a heart charm piece made to be kept close. Hand-finished premium gold plated jewellery, personalised with the engraving of your choice.",
    category: "bracelets",
    basePrice: 99,
    badge: null as string | null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1788639976759-b1jmk8.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["heart", "engravable", "gold plated"],
    occasion: [] as string[],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name or date" },
    },
    variants: [
      { id: "var_mtou4sd6c2eh4mc2", metal: "gold", lengthCm: 12, price: 99, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-002",
    slug: "anniversary-special",
    name: "Anniversary special",
    nameAr: null,
    description:
      "A delicate bracelet engraved with the date that matters most. Hand-finished premium gold plated jewellery — a quiet way to keep an anniversary close.",
    category: "bracelets",
    basePrice: 22.25,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1788938107594-adn788.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["bracelet", "engravable", "gold plated", "anniversary"],
    occasion: ["Anniversary"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a date or name" },
    },
    variants: [
      { id: "var_mttrluay19qrov8z", metal: "gold", lengthCm: 10, price: 22.25, inStock: true, stockCount: 10 },
      { id: "var_mttrltytt9f5p7hp", metal: "gold", lengthCm: 12, price: 22.25, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-003",
    slug: "hime-02",
    name: "Hime 02",
    nameAr: null,
    description:
      "A minimalist personalised piece from the Hime series, hand-finished in premium gold plated jewellery and engraved just for her.",
    category: "necklaces",
    basePrice: 25,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1788938874818-axzff4.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["engravable", "gold plated", "minimal"],
    occasion: [],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      // Order history showed this variant sold at 0 (promotional order) — price set to 25, update in admin if needed.
      { id: "var_mtts1mmbwdjpv9ug", metal: "gold", price: 25, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-004",
    slug: "hime-08",
    name: "Hime 08",
    nameAr: null,
    description:
      "A personalised ring from the Hime series, hand-finished in premium gold plated jewellery and engraved with the name that matters.",
    category: "rings",
    basePrice: 25,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1788947221282-tscoj6.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["ring", "engravable", "gold plated"],
    occasion: [],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      { id: "var_mttx0did7j11sdvt", metal: "gold", size: "25", price: 25, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-005",
    slug: "hime-12",
    name: "Hime 12",
    nameAr: null,
    description:
      "A personalised necklace from the Hime series, hand-finished in premium gold plated jewellery — made to order, just for her.",
    category: "necklaces",
    basePrice: 22.5,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1788947674312-93sgz3.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["necklace", "engravable", "gold plated"],
    occasion: [],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      { id: "var_mttxa800qmqdfm1a", metal: "gold", price: 22.5, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-006",
    slug: "custom-monogram-date-pendant",
    name: "Custom Monogram Date Pendant",
    nameAr: null,
    description:
      "A monogram and a date, kept close to the heart. This custom pendant is hand-finished in premium gold plated jewellery and engraved to order.",
    category: "necklaces",
    basePrice: 22.8,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789629557024-b4lc9p.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["pendant", "engravable", "gold plated", "monogram"],
    occasion: ["Anniversary", "Wedding"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "M&R, 5-12-2005" },
    },
    variants: [
      { id: "var_mu57op3cwdhzd7ts", metal: "gold", lengthCm: 20, price: 22.8, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-007",
    slug: "ethereal-butterfly-couple-custom-bangle",
    name: "Ethereal Butterfly Couple Custom Bangle",
    nameAr: null,
    description:
      "A butterfly bangle for two names, two initials, one story. Hand-finished premium gold plated jewellery, engraved for couples.",
    category: "bracelets",
    basePrice: 27,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789569075051-09jfv8.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["bangle", "couple", "engravable", "gold plated"],
    occasion: ["Valentine's Day", "Anniversary"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Mia & Alex" },
    },
    variants: [
      { id: "var_mu478v0dxp4riav4", metal: "gold", lengthCm: 10, price: 27, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-008",
    slug: "rolex-customized-name-bracelet",
    name: "Rolex Customized Name Bracelet",
    nameAr: null,
    description:
      "A bold name bracelet with a premium plated finish, engraved with the name of your choice. Made to order, made for her.",
    category: "bracelets",
    basePrice: 29.32,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789575350698-n83p36.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["bracelet", "name", "engravable", "gold plated"],
    occasion: ["Birthday", "Just Because"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      { id: "75a03099-85e7-4aa0-8fe7-21f172f5800a", metal: "blue", lengthCm: 12, price: 29.32, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-009",
    slug: "signature-arabic-nameplate-bracelet",
    name: "Signature Arabic Nameplate Bracelet",
    nameAr: "سوار بالاسم العربي",
    description:
      "Her name in elegant Arabic script, hand-finished as premium gold plated jewellery. A signature piece, made to order.",
    category: "bracelets",
    basePrice: 25,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789579075248-kqbvlj.jpg",
    ],
    materials: ["Gold Plated", "Silver Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["arabic", "nameplate", "engravable", "gold plated"],
    occasion: ["Eid", "Birthday"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "اسمكِ هنا" },
    },
    variants: [
      { id: "var_mu4dmz8ro92gdo7s", metal: "gold", lengthCm: 12, price: 25, inStock: true, stockCount: 10 },
      { id: "var_mu4dmzle4menbv6z", metal: "silver", lengthCm: 12, price: 25, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-010",
    slug: "sweetheart-layered-custom-necklace",
    name: "Sweetheart Layered Custom Necklace",
    nameAr: null,
    description:
      "A layered necklace with a sweetheart charm, engraved with her name. Hand-finished premium gold plated jewellery, made to order.",
    category: "necklaces",
    basePrice: 21.31,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789582168374-m2al0n.png",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["layered", "heart", "engravable", "gold plated"],
    occasion: ["Valentine's Day", "Anniversary"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      { id: "f3a99312-9b3c-4905-9136-77fb3a1e592a", metal: "gold", lengthCm: 18, price: 21.31, inStock: true, stockCount: 10 },
    ],
  },
  {
    id: "real-011",
    slug: "royal-custom-name-necklace",
    name: "Royal Custom Name Necklace",
    nameAr: null,
    description:
      "Her name in a royal script, hand-finished as premium gold plated jewellery. A custom necklace made just for her.",
    category: "necklaces",
    basePrice: 21.7,
    badge: null,
    rating: 0,
    reviewCount: 0,
    images: [
      "https://ibdyreoqctdixnuwyrfe.supabase.co/storage/v1/object/public/product-images/products/1789586359219-vapom7.jpg",
    ],
    materials: ["Gold Plated"],
    careInstructions:
      "Avoid contact with water, perfume and lotion. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["name", "necklace", "engravable", "gold plated"],
    occasion: ["Birthday", "Just Because"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a name" },
    },
    variants: [
      // Order history referenced Hime 12's variant id for this product too — assigned a fresh id here since variant ids must be unique.
      { id: "var_royal-custom-name-necklace-gold-20", metal: "gold", lengthCm: 20, price: 21.7, inStock: true, stockCount: 10 },
    ],
  },
];

const PROMO_CODES = [
  { code: "WELCOME15", type: "percent", amount: 15, minOrderUsd: 0 },
  { code: "EID20", type: "percent", amount: 20, minOrderUsd: 100 },
  { code: "GIFT10", type: "fixed", amount: 10, minOrderUsd: 75 },
];

let productCount = 0;
let variantCount = 0;

async function seed() {
  await db.transaction(async (tx) => {
    // Idempotent: clear ONLY seed-managed product ids (children cascade).
    // Never a blanket delete — live catalogue data must survive re-seeds.
    await tx.delete(products).where(inArray(products.id, SEED_PRODUCT_IDS));
    await tx.delete(promoCodes);

    for (const p of PRODUCTS_SEED) {
      await tx.insert(products).values({
        id: p.id,
        slug: p.slug,
        name: p.name,
        nameAr: p.nameAr ?? null,
        description: p.description,
        descriptionAr: null,
        category: p.category,
        basePrice: p.basePrice,
        compareAtPrice: null,
        images: p.images,
        badge: p.badge || null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        materials: p.materials,
        careInstructions: p.careInstructions,
        isHalalFriendly: false,
        isHypoallergenic: !!p.isHypoallergenic,
        tags: p.tags,
        occasion: p.occasion || [],
        personalization: p.personalization || {},
        isActive: true,
      });
      productCount++;

      for (const v of p.variants as any[]) {
        await tx.insert(productVariants).values({
          id: v.id,
          productId: p.id,
          metal: v.metal,
          lengthCm: v.lengthCm ?? null,
          size: v.size ?? null,
          price: v.price,
          inStock: !!v.inStock,
          madeToOrder: false,
          productionDays: null,
          stockCount: v.stockCount || 0,
        });
        variantCount++;
      }
    }

    for (const promo of PROMO_CODES) {
      await tx.insert(promoCodes).values({
        code: promo.code,
        type: promo.type,
        amount: promo.amount,
        minOrderUsd: promo.minOrderUsd,
        isActive: true,
      });
    }
  });
}

seed()
  .then(() => {
    console.log(
      `✓ Seeded ${productCount} products, ${variantCount} variants, ${PROMO_CODES.length} promo codes`
    );
    process.exit(0);
  })
  .catch((e) => {
    console.error("seed failed:", e);
    process.exit(1);
  });
