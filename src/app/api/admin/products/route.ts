export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

const productSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  nameAr: z.string().optional(),
  description: z.string().min(1),
  descriptionAr: z.string().optional(),
  category: z.string().min(1),
  basePrice: z.number().min(0),
  compareAtPrice: z.number().nullable().optional(),
  currency: z.string().default("USD"),
  images: z.array(z.string()).min(1),
  badge: z.enum(["new", "bestseller", "sale", "limited"]).nullable().optional(),
  materials: z.array(z.string()).min(1),
  careInstructions: z.string().min(1),
  isHalalFriendly: z.boolean().default(false),
  isHypoallergenic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  occasion: z.array(z.string()).default([]),
  personalization: z
    .object({
      engraving: z
        .object({ maxLength: z.number(), placeholder: z.string() })
        .optional(),
      gemstone: z.boolean().optional(),
      charm: z.boolean().optional(),
      length: z
        .object({ options: z.array(z.number()), default: z.number() })
        .optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        metal: z.string(),
        lengthCm: z.number().nullable().optional(),
        size: z.string().nullable().optional(),
        price: z.number().min(0),
        inStock: z.boolean().default(true),
        madeToOrder: z.boolean().default(false),
        productionDays: z.string().nullable().optional(),
        stockCount: z.number().int().min(0).default(0),
      })
    )
    .min(1),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
    const products = await db
      .select()
      .from(schema.products)
      .orderBy(desc(schema.products.createdAt));
    return apiSuccess({ products });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = productSchema.parse(body);

    const existing = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.slug, data.slug))
      .limit(1);
    if (existing.length > 0) {
      return apiError("A product with that slug already exists", 409);
    }

    const id = generateId("p");
    await db.insert(schema.products).values({
      id,
      slug: data.slug,
      name: data.name,
      nameAr: data.nameAr || null,
      description: data.description,
      descriptionAr: data.descriptionAr || null,
      category: data.category,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice || null,
      currency: data.currency,
      images: data.images,
      badge: data.badge || null,
      materials: data.materials,
      careInstructions: data.careInstructions,
      isHalalFriendly: data.isHalalFriendly,
      isHypoallergenic: data.isHypoallergenic,
      tags: data.tags,
      occasion: data.occasion,
      personalization: data.personalization || {},
      isActive: data.isActive,
    });

    for (const v of data.variants) {
      await db.insert(schema.productVariants).values({
        id: v.id || generateId("var"),
        productId: id,
        metal: v.metal,
        lengthCm: v.lengthCm || null,
        size: v.size || null,
        price: v.price,
        inStock: v.inStock,
        madeToOrder: v.madeToOrder,
        productionDays: v.productionDays || null,
        stockCount: v.stockCount,
      });
    }

    return apiSuccess({ id, slug: data.slug }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}