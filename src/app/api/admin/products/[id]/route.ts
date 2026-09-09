export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { eq } from "drizzle-orm";

const updateSchema = z.object({
  name: z.string().optional(),
  nameAr: z.string().nullable().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().nullable().optional(),
  category: z.string().optional(),
  basePrice: z.number().min(0).optional(),
  compareAtPrice: z.number().nullable().optional(),
  images: z.array(z.string()).optional(),
  badge: z.enum(["new", "bestseller", "sale", "limited"]).nullable().optional(),
  materials: z.array(z.string()).optional(),
  careInstructions: z.string().optional(),
  isHalalFriendly: z.boolean().optional(),
  isHypoallergenic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  occasion: z.array(z.string()).optional(),
  personalization: z.any().optional(),
  isActive: z.boolean().optional(),
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
    .optional(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    // Uniform pricing: variants (when provided) are always priced at the base price.
    let basePrice = data.basePrice;
    if (basePrice === undefined) {
      const rows = await db
        .select({ basePrice: schema.products.basePrice })
        .from(schema.products)
        .where(eq(schema.products.id, id))
        .limit(1);
      basePrice = rows[0]?.basePrice;
    }
    if (data.variants && basePrice !== undefined) {
      for (const v of data.variants) v.price = basePrice;
    }

    const { variants, ...productFields } = data;

    if (Object.keys(productFields).length > 0) {
      await db
        .update(schema.products)
        .set(productFields)
        .where(eq(schema.products.id, id));
    }

    // Replace variants wholesale when provided.
    if (variants) {
      await db
        .delete(schema.productVariants)
        .where(eq(schema.productVariants.productId, id));
      for (const v of variants) {
        await db.insert(schema.productVariants).values({
          id: v.id || crypto.randomUUID(),
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
    }

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.delete(schema.products).where(eq(schema.products.id, id));
    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .limit(1);
    if (product.length === 0) return apiError("Product not found", 404);
    const variants = await db
      .select()
      .from(schema.productVariants)
      .where(eq(schema.productVariants.productId, id));
    return apiSuccess({ product: product[0], variants });
  } catch (err) {
    return handleApiError(err);
  }
}