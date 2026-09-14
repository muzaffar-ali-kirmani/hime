import type { MetalFinish } from "./types";

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
  { id: "necklaces", name: "Necklaces", nameAr: "القلائد", image: "/necklace.jpeg" },
  { id: "bracelets", name: "Bracelets", nameAr: "الأساور", image: "/bracelet.jpeg" },
  { id: "rings", name: "Rings", nameAr: "الخواتم", image: "/ring.jpeg" },
  { id: "earrings", name: "Earrings", nameAr: "الأقراط", image: svgImage("Earrings", "silver", "earrings") },
  { id: "anklets", name: "Anklets", nameAr: "الخلاخيل", image: svgImage("Anklet", "gold", "anklet") },
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
    product: "Custom Design",
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
  { title: "Made-to-order", description: "Handcrafted in 5–7 days, just for her." },
];
