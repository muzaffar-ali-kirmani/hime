import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DATABASE_URL?.replace(/^file:/, "") ||
  path.join(process.cwd(), "data", "hime.db");

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");

const PRODUCTS_SEED = [
  {
    id: "p-001",
    slug: "celeste-initial-pendant",
    name: "Celeste Initial Pendant",
    nameAr: "قلادة سيليست بالحرف الأول",
    description:
      "A whisper of gold, a letter that means everything. The Celeste Initial Pendant is hand-finished in 18K gold vermeil with a delicate chain you can layer or wear alone.",
    category: "necklaces",
    basePrice: 189,
    badge: "bestseller",
    rating: 4.9,
    reviewCount: 312,
    materials: ["18K Gold Vermeil", "Sterling Silver Core"],
    careInstructions:
      "Avoid contact with perfumes and lotions. Store in the pouch provided.",
    isHypoallergenic: true,
    tags: ["initial", "engravable", "18K", "layering"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      gemstone: true,
      length: { options: [40, 45, 50], default: 45 },
    },
    variants: [
      { id: "gold-40", metal: "gold", lengthCm: 40, price: 189, inStock: true, stockCount: 8 },
      { id: "gold-45", metal: "gold", lengthCm: 45, price: 189, inStock: true, stockCount: 12 },
      { id: "gold-50", metal: "gold", lengthCm: 50, price: 189, inStock: true, stockCount: 6 },
      { id: "rose-gold-40", metal: "rose-gold", lengthCm: 40, price: 204, inStock: true, stockCount: 4 },
      { id: "rose-gold-45", metal: "rose-gold", lengthCm: 45, price: 204, inStock: true, stockCount: 5 },
      { id: "rose-gold-50", metal: "rose-gold", lengthCm: 50, price: 204, inStock: true, stockCount: 3 },
      { id: "silver-40", metal: "silver", lengthCm: 40, price: 164, inStock: true, stockCount: 7 },
      { id: "silver-45", metal: "silver", lengthCm: 45, price: 164, inStock: true, stockCount: 9 },
      { id: "silver-50", metal: "silver", lengthCm: 50, price: 164, inStock: true, stockCount: 4 },
    ],
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
    badge: "new",
    rating: 4.8,
    reviewCount: 184,
    materials: ["18K Gold", "Natural Gemstone"],
    careInstructions:
      "Remove before showering. Wipe gently with the included polishing cloth.",
    isHypoallergenic: true,
    isHalalFriendly: true,
    tags: ["birthstone", "engravable", "18K"],
    occasion: ["Birthday", "Mother's Day"],
    personalization: {
      gemstone: true,
      engraving: { maxLength: 12, placeholder: "Engrave a name" },
      length: { options: [40, 45, 50], default: 45 },
    },
    variants: [
      { id: "gold-40", metal: "gold", lengthCm: 40, price: 229, inStock: true, stockCount: 6 },
      { id: "gold-45", metal: "gold", lengthCm: 45, price: 229, inStock: true, stockCount: 8 },
      { id: "gold-50", metal: "gold", lengthCm: 50, price: 229, inStock: true, stockCount: 4 },
      { id: "rose-gold-45", metal: "rose-gold", lengthCm: 45, price: 244, inStock: true, stockCount: 3 },
      { id: "silver-45", metal: "silver", lengthCm: 45, price: 204, inStock: true, stockCount: 5 },
    ],
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
    rating: 4.9,
    reviewCount: 421,
    materials: ["925 Sterling Silver"],
    careInstructions: "Polish with a soft cloth. Avoid water and harsh chemicals.",
    isHypoallergenic: true,
    tags: ["name", "engravable", "silver"],
    occasion: ["Anniversary", "Just Because"],
    personalization: {
      engraving: { maxLength: 10, placeholder: "Her name" },
      length: { options: [40, 45, 50, 55], default: 45 },
    },
    variants: [
      { id: "silver-40", metal: "silver", lengthCm: 40, price: 159, inStock: true, stockCount: 6 },
      { id: "silver-45", metal: "silver", lengthCm: 45, price: 159, inStock: true, stockCount: 12 },
      { id: "silver-50", metal: "silver", lengthCm: 50, price: 159, inStock: true, stockCount: 8 },
      { id: "silver-55", metal: "silver", lengthCm: 55, price: 159, inStock: false, madeToOrder: true, productionDays: "7-10 days" },
    ],
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
    badge: "bestseller",
    rating: 4.8,
    reviewCount: 567,
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Store dry. Polish gently with the included cloth.",
    isHypoallergenic: true,
    tags: ["charm", "engravable", "stackable"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
    personalization: {
      charm: true,
      engraving: { maxLength: 8, placeholder: "Add a word" },
      length: { options: [16, 18, 20], default: 18 },
    },
    variants: [
      { id: "rose-gold-16", metal: "rose-gold", lengthCm: 16, price: 134, inStock: true, stockCount: 9 },
      { id: "rose-gold-18", metal: "rose-gold", lengthCm: 18, price: 134, inStock: true, stockCount: 15 },
      { id: "rose-gold-20", metal: "rose-gold", lengthCm: 20, price: 134, inStock: true, stockCount: 7 },
      { id: "gold-18", metal: "gold", lengthCm: 18, price: 119, inStock: true, stockCount: 8 },
      { id: "silver-18", metal: "silver", lengthCm: 18, price: 94, inStock: true, stockCount: 11 },
    ],
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
    badge: "limited",
    rating: 5.0,
    reviewCount: 92,
    materials: ["18K Gold", "Solid Sterling Silver"],
    careInstructions: "Remove before sleep and exercise.",
    isHalalFriendly: true,
    isHypoallergenic: true,
    tags: ["signet", "engravable", "18K", "heirloom"],
    occasion: ["Engagement", "Anniversary", "Birthday"],
    personalization: {
      engraving: { maxLength: 2, placeholder: "AB" },
    },
    variants: [
      { id: "gold-6", metal: "gold", size: "6", price: 269, inStock: true, stockCount: 3 },
      { id: "gold-7", metal: "gold", size: "7", price: 269, inStock: true, stockCount: 5 },
      { id: "gold-8", metal: "gold", size: "8", price: 269, inStock: true, stockCount: 2 },
      { id: "silver-6", metal: "silver", size: "6", price: 219, inStock: true, stockCount: 4 },
      { id: "silver-7", metal: "silver", size: "7", price: 219, inStock: true, stockCount: 6 },
      { id: "silver-8", metal: "silver", size: "8", price: 219, inStock: false, madeToOrder: true, productionDays: "10-14 days" },
    ],
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
    badge: "new",
    rating: 4.9,
    reviewCount: 138,
    materials: ["18K Gold", "Freshwater Pearl"],
    careInstructions: "Keep away from moisture. Wipe with a soft cloth after wear.",
    isHypoallergenic: true,
    tags: ["pearl", "18K", "hoops"],
    occasion: ["Wedding", "Anniversary", "Just Because"],
    variants: [
      { id: "gold", metal: "gold", price: 199, inStock: true, stockCount: 7 },
      { id: "rose-gold", metal: "rose-gold", price: 214, inStock: true, stockCount: 3 },
      { id: "silver", metal: "silver", price: 174, inStock: true, stockCount: 5 },
    ],
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
    rating: 4.7,
    reviewCount: 76,
    materials: ["18K Gold Vermeil"],
    careInstructions: "Avoid contact with water and lotions.",
    isHypoallergenic: true,
    tags: ["initial", "anklet", "18K"],
    occasion: ["Birthday", "Just Because"],
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      length: { options: [22, 24, 26], default: 24 },
    },
    variants: [
      { id: "gold-22", metal: "gold", lengthCm: 22, price: 109, inStock: true, stockCount: 5 },
      { id: "gold-24", metal: "gold", lengthCm: 24, price: 109, inStock: true, stockCount: 8 },
      { id: "gold-26", metal: "gold", lengthCm: 26, price: 109, inStock: true, stockCount: 4 },
      { id: "rose-gold-24", metal: "rose-gold", lengthCm: 24, price: 124, inStock: true, stockCount: 3 },
      { id: "silver-24", metal: "silver", lengthCm: 24, price: 84, inStock: true, stockCount: 6 },
    ],
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
    rating: 4.8,
    reviewCount: 89,
    materials: ["925 Sterling Silver", "Cubic Zirconia"],
    careInstructions: "Remove before showering and sleeping.",
    isHypoallergenic: true,
    tags: ["tennis", "silver", "everyday"],
    occasion: ["Wedding", "Anniversary"],
    personalization: {
      length: { options: [16, 18, 20], default: 18 },
    },
    variants: [
      { id: "silver-16", metal: "silver", lengthCm: 16, price: 249, inStock: true, stockCount: 4 },
      { id: "silver-18", metal: "silver", lengthCm: 18, price: 249, inStock: true, stockCount: 7 },
      { id: "silver-20", metal: "silver", lengthCm: 20, price: 249, inStock: true, stockCount: 3 },
      { id: "gold-18", metal: "gold", lengthCm: 18, price: 274, inStock: false, madeToOrder: true, productionDays: "10-14 days" },
    ],
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
    compareAtPrice: 99,
    badge: "sale",
    rating: 4.8,
    reviewCount: 234,
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Store dry in original pouch.",
    isHypoallergenic: true,
    tags: ["charm", "engravable", "set"],
    occasion: ["Birthday", "Just Because"],
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
      charm: true,
    },
    variants: [
      { id: "rose-gold", metal: "rose-gold", price: 79, inStock: true, stockCount: 14 },
      { id: "gold", metal: "gold", price: 79, inStock: true, stockCount: 9 },
      { id: "silver", metal: "silver", price: 54, inStock: true, stockCount: 12 },
    ],
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
    badge: "new",
    rating: 4.7,
    reviewCount: 51,
    materials: ["925 Sterling Silver", "Pavé CZ"],
    careInstructions: "Keep dry. Store flat.",
    isHypoallergenic: true,
    tags: ["statement", "silver", "occasion"],
    occasion: ["Wedding", "Eid"],
    variants: [
      { id: "silver", metal: "silver", price: 219, inStock: true, stockCount: 6 },
      { id: "gold", metal: "gold", price: 244, inStock: true, stockCount: 3 },
    ],
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
    rating: 4.9,
    reviewCount: 198,
    materials: ["18K Rose Gold Vermeil"],
    careInstructions: "Avoid water. Polish gently.",
    isHypoallergenic: true,
    tags: ["heart", "engravable", "gift"],
    occasion: ["Valentine's Day", "Anniversary"],
    personalization: {
      engraving: { maxLength: 14, placeholder: "Add a message" },
      length: { options: [40, 45, 50], default: 45 },
    },
    variants: [
      { id: "rose-gold-40", metal: "rose-gold", lengthCm: 40, price: 164, inStock: true, stockCount: 7 },
      { id: "rose-gold-45", metal: "rose-gold", lengthCm: 45, price: 164, inStock: true, stockCount: 11 },
      { id: "rose-gold-50", metal: "rose-gold", lengthCm: 50, price: 164, inStock: true, stockCount: 5 },
      { id: "gold-45", metal: "gold", lengthCm: 45, price: 149, inStock: true, stockCount: 6 },
      { id: "silver-45", metal: "silver", lengthCm: 45, price: 124, inStock: true, stockCount: 8 },
    ],
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
    rating: 4.8,
    reviewCount: 67,
    materials: ["18K Gold Vermeil"],
    careInstructions: "Remove before washing hands.",
    isHypoallergenic: true,
    tags: ["stacking", "engravable", "18K"],
    occasion: ["Birthday", "Anniversary", "Just Because"],
    personalization: {
      engraving: { maxLength: 1, placeholder: "A" },
    },
    variants: [
      { id: "gold-5", metal: "gold", size: "5", price: 189, inStock: true, stockCount: 4 },
      { id: "gold-6", metal: "gold", size: "6", price: 189, inStock: true, stockCount: 7 },
      { id: "gold-7", metal: "gold", size: "7", price: 189, inStock: true, stockCount: 6 },
      { id: "gold-8", metal: "gold", size: "8", price: 189, inStock: true, stockCount: 3 },
      { id: "rose-gold-7", metal: "rose-gold", size: "7", price: 204, inStock: false, madeToOrder: true, productionDays: "7-10 days" },
    ],
  },
];

const PROMO_CODES = [
  { code: "WELCOME15", type: "percent", amount: 15, minOrderUsd: 0 },
  { code: "EID20", type: "percent", amount: 20, minOrderUsd: 100 },
  { code: "GIFT10", type: "fixed", amount: 10, minOrderUsd: 75 },
];

const insertProduct = sqlite.prepare(`
  INSERT OR REPLACE INTO products (
    id, slug, name, name_ar, description, description_ar, category,
    base_price, compare_at_price, currency, images, badge, rating, review_count,
    materials, care_instructions, is_halal_friendly, is_hypoallergenic,
    tags, occasion, personalization, is_active
  ) VALUES (
    @id, @slug, @name, @nameAr, @description, @descriptionAr, @category,
    @basePrice, @compareAtPrice, 'USD', @images, @badge, @rating, @reviewCount,
    @materials, @careInstructions, @isHalalFriendly, @isHypoallergenic,
    @tags, @occasion, @personalization, 1
  )
`);

const insertVariant = sqlite.prepare(`
  INSERT OR REPLACE INTO product_variants (
    id, product_id, metal, length_cm, size, price, in_stock, made_to_order, production_days, stock_count
  ) VALUES (
    @id, @productId, @metal, @lengthCm, @size, @price, @inStock, @madeToOrder, @productionDays, @stockCount
  )
`);

const insertPromo = sqlite.prepare(`
  INSERT OR REPLACE INTO promo_codes (code, type, amount, min_order_usd, is_active)
  VALUES (@code, @type, @amount, @minOrderUsd, 1)
`);

const svgFor = (label: string, metal: string) => {
  const g = metal === "gold" ? "%23E8D9B8" : metal === "rose-gold" ? "%23F4D4C4" : "%23F0F0F0";
  const d = metal === "gold" ? "%23A88A4D" : metal === "rose-gold" ? "%23B8866F" : "%23A8A8A8";
  return `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23F7F3EB'/%3E%3Cstop offset='1' stop-color='%23EFE7D8'/%3E%3C/linearGradient%3E%3ClinearGradient id='m' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='${g}'/%3E%3Cstop offset='1' stop-color='${d}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='750' fill='url(%23g)'/%3E%3Ccircle cx='300' cy='320' r='110' fill='url(%23m)' opacity='0.85'/%3E%3Ccircle cx='300' cy='320' r='60' fill='%23F7F3EB'/%3E%3Ctext x='300' y='450' font-family='Cormorant Garamond' font-size='34' fill='%231D2A44' text-anchor='middle' font-style='italic'%3E${label}%3C/text%3E%3C/svg%3E`;
};

let productCount = 0;
let variantCount = 0;

const seed = sqlite.transaction(() => {
  for (const p of PRODUCTS_SEED) {
    const imageMetal = p.variants[0]?.metal || "gold";
    const label = p.name.split(" ")[0];
    insertProduct.run({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameAr: p.nameAr,
      description: p.description,
      descriptionAr: null,
      category: p.category,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || null,
      images: JSON.stringify([svgFor(label, imageMetal)]),
      badge: p.badge || null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      materials: JSON.stringify(p.materials),
      careInstructions: p.careInstructions,
      isHalalFriendly: p.isHalalFriendly ? 1 : 0,
      isHypoallergenic: p.isHypoallergenic ? 1 : 0,
      tags: JSON.stringify(p.tags),
      occasion: JSON.stringify(p.occasion || []),
      personalization: JSON.stringify(p.personalization || {}),
    });
    productCount++;

    for (const v of p.variants as any[]) {
      insertVariant.run({
        id: `${p.id}-${v.id}`,
        productId: p.id,
        metal: v.metal,
        lengthCm: v.lengthCm || null,
        size: v.size || null,
        price: v.price,
        inStock: v.inStock ? 1 : 0,
        madeToOrder: v.madeToOrder ? 1 : 0,
        productionDays: v.productionDays || null,
        stockCount: v.stockCount || 0,
      });
      variantCount++;
    }
  }

  for (const promo of PROMO_CODES) {
    insertPromo.run(promo);
  }
});

seed();

console.log(`✓ Seeded ${productCount} products, ${variantCount} variants, ${PROMO_CODES.length} promo codes`);
sqlite.close();