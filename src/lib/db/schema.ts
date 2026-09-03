import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  country: text("country").default("AE"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nameAr: text("name_ar"),
    description: text("description").notNull(),
    descriptionAr: text("description_ar"),
    category: text("category").notNull(),
    basePrice: real("base_price").notNull(),
    compareAtPrice: real("compare_at_price"),
    currency: text("currency").notNull().default("USD"),
    images: text("images", { mode: "json" }).$type<string[]>().notNull(),
    badge: text("badge"),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    materials: text("materials", { mode: "json" }).$type<string[]>().notNull(),
    careInstructions: text("care_instructions").notNull(),
    isHalalFriendly: integer("is_halal_friendly", { mode: "boolean" })
      .notNull()
      .default(false),
    isHypoallergenic: integer("is_hypoallergenic", { mode: "boolean" })
      .notNull()
      .default(false),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
    occasion: text("occasion", { mode: "json" }).$type<string[]>(),
    personalization: text("personalization", { mode: "json" }).$type<{
      engraving?: { maxLength: number; placeholder: string };
      gemstone?: boolean;
      charm?: boolean;
      length?: { options: number[]; default: number };
    }>(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    categoryIdx: index("products_category_idx").on(t.category),
    activeIdx: index("products_active_idx").on(t.isActive),
  })
);

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    metal: text("metal").notNull(),
    lengthCm: real("length_cm"),
    size: text("size"),
    price: real("price").notNull(),
    inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
    madeToOrder: integer("made_to_order", { mode: "boolean" })
      .notNull()
      .default(false),
    productionDays: text("production_days"),
    stockCount: integer("stock_count").notNull().default(0),
  },
  (t) => ({
    productIdx: index("variants_product_idx").on(t.productId),
  })
);

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    guestEmail: text("guest_email"),
    status: text("status").notNull().default("pending"),
    paymentStatus: text("payment_status").notNull().default("pending"),
    paymentMethod: text("payment_method").notNull(),
    currency: text("currency").notNull().default("AED"),
    subtotalUsd: real("subtotal_usd").notNull(),
    shippingUsd: real("shipping_usd").notNull().default(0),
    taxUsd: real("tax_usd").notNull().default(0),
    totalUsd: real("total_usd").notNull(),
    promoCode: text("promo_code"),
    promoDiscount: real("promo_discount").notNull().default(0),
    giftWrap: integer("gift_wrap", { mode: "boolean" }).notNull().default(false),
    giftNote: text("gift_note"),
    shippingName: text("shipping_name").notNull(),
    shippingEmail: text("shipping_email"),
    shippingPhone: text("shipping_phone").notNull(),
    shippingAddress1: text("shipping_address1").notNull(),
    shippingAddress2: text("shipping_address2"),
    shippingCity: text("shipping_city").notNull(),
    shippingArea: text("shipping_area"),
    shippingCountry: text("shipping_country").notNull(),
    shippingNotes: text("shipping_notes"),
    trackingNumber: text("tracking_number"),
    adminNotes: text("admin_notes"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("orders_user_idx").on(t.userId),
    statusIdx: index("orders_status_idx").on(t.status),
  })
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    productImage: text("product_image").notNull(),
    variantId: text("variant_id").notNull(),
    metal: text("metal").notNull(),
    lengthCm: real("length_cm"),
    size: text("size"),
    unitPriceUsd: real("unit_price_usd").notNull(),
    quantity: integer("quantity").notNull(),
    engravingText: text("engraving_text"),
    gemstone: text("gemstone"),
    charmIds: text("charm_ids", { mode: "json" }).$type<string[]>(),
  },
  (t) => ({
    orderIdx: index("order_items_order_idx").on(t.orderId),
  })
);

export const savedDesigns = sqliteTable(
  "saved_designs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id"),
    productName: text("product_name").notNull(),
    config: text("config", { mode: "json" })
      .$type<Record<string, string>>()
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("designs_user_idx").on(t.userId),
  })
);

export const wishlistItems = sqliteTable(
  "wishlist_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("wishlist_user_idx").on(t.userId),
    uniquePair: index("wishlist_unique_idx").on(t.userId, t.productId),
  })
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    authorName: text("author_name").notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body").notNull(),
    isVerified: integer("is_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    isApproved: integer("is_approved", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    productIdx: index("reviews_product_idx").on(t.productId),
  })
);

export const homepageSections = sqliteTable("homepage_sections", {
  id: text("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  body: text("body"),
  imageUrl: text("image_url"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const addresses = sqliteTable(
  "addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    address1: text("address1").notNull(),
    address2: text("address2"),
    city: text("city").notNull(),
    area: text("area"),
    country: text("country").notNull(),
    isDefault: integer("is_default", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (t) => ({
    userIdx: index("addresses_user_idx").on(t.userId),
  })
);

export const promoCodes = sqliteTable("promo_codes", {
  code: text("code").primaryKey(),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  minOrderUsd: real("min_order_usd").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const recentlyViewed = sqliteTable(
  "recently_viewed",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    viewedAt: integer("viewed_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("recently_user_idx").on(t.userId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type SavedDesign = typeof savedDesigns.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type Address = typeof addresses.$inferSelect;