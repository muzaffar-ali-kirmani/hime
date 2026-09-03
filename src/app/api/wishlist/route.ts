export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq, and, inArray } from "drizzle-orm";

const addSchema = z.object({
  productId: z.string().min(1),
});

export async function GET() {
  try {
    const user = await requireUser();
    const items = await db
      .select()
      .from(schema.wishlistItems)
      .where(eq(schema.wishlistItems.userId, user.id));

    if (items.length === 0) {
      return apiSuccess({ items: [] });
    }

    const productIds = items.map((i) => i.productId);
    const products = await db
      .select()
      .from(schema.products)
      .where(inArray(schema.products.id, productIds));

    return apiSuccess({
      items: items.map((i) => ({
        ...i,
        product: products.find((p) => p.id === i.productId),
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = addSchema.parse(body);

    const existing = await db
      .select()
      .from(schema.wishlistItems)
      .where(
        and(
          eq(schema.wishlistItems.userId, user.id),
          eq(schema.wishlistItems.productId, data.productId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return apiError("Already in wishlist", 409);
    }

    await db.insert(schema.wishlistItems).values({
      id: generateId("wl"),
      userId: user.id,
      productId: data.productId,
    });

    return apiSuccess({ success: true }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) return apiError("productId required", 400);

    await db
      .delete(schema.wishlistItems)
      .where(
        and(
          eq(schema.wishlistItems.userId, user.id),
          eq(schema.wishlistItems.productId, productId)
        )
      );

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}