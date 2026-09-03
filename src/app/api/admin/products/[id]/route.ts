export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { eq } from "drizzle-orm";

const updateSchema = z.object({
  name: z.string().optional(),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
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

    await db
      .update(schema.products)
      .set(data)
      .where(eq(schema.products.id, id));

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