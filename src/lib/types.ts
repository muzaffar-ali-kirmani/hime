export type Currency = "AED" | "SAR" | "QAR" | "KWD" | "BHD" | "OMR" | "USD";
export type Language = "en" | "ar";
export type Country = "AE" | "SA" | "QA" | "KW" | "BH" | "OM";

export type MetalFinish = "gold" | "rose-gold" | "silver";
export type ProductCategory =
  | "necklaces"
  | "bracelets"
  | "rings"
  | "earrings"
  | "anklets"
  | "initial-charm";

export type Gemstone =
  | "diamond"
  | "sapphire"
  | "ruby"
  | "emerald"
  | "amethyst"
  | "pearl"
  | "garnet"
  | "topaz"
  | "aquamarine"
  | "opal"
  | "turquoise"
  | "none";

export interface PersonalizationOption {
  id: string;
  type: "engraving" | "gemstone" | "charm" | "length";
  label: string;
  labelAr?: string;
  priceModifier?: number;
  meta?: Record<string, string | string[]>;
}

export interface ProductVariant {
  id: string;
  metal: MetalFinish;
  lengthCm?: number;
  size?: string;
  price: number;
  inStock: boolean;
  madeToOrder?: boolean;
  productionDays?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: ProductCategory;
  basePrice: number;
  compareAtPrice?: number;
  currency: Currency;
  images: string[];
  badge?: "new" | "bestseller" | "sale" | "limited";
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  personalization?: {
    engraving?: { maxLength: number; placeholder: string };
    gemstone?: boolean;
    charm?: boolean;
    length?: { options: number[]; default: number };
  };
  materials: string[];
  careInstructions: string;
  isHalalFriendly?: boolean;
  isHypoallergenic?: boolean;
  tags: string[];
  occasion?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  variant: ProductVariant;
  personalization?: {
    engravingText?: string;
    gemstone?: Gemstone;
    charmIds?: string[];
    giftWrap?: boolean;
    giftNote?: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface SavedDesign {
  id: string;
  productId: string;
  productName: string;
  config: Record<string, string>;
  createdAt: number;
}