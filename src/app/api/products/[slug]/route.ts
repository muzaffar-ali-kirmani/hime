export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await db
      .select()
      .from(schema.products)
      .where(
        and(eq(schema.products.slug, slug), eq(schema.products.isActive, true))
      )
      .limit(1);

    if (product.length === 0) {
      return apiError("Product not found", 404);
    }

    const variants = await db
      .select()
      .from(schema.productVariants)
      .where(eq(schema.productVariants.productId, product[0].id));

    const reviews = await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.productId, product[0].id))
      .orderBy(schema.reviews.createdAt)
      .limit(20);

    return apiSuccess({
      product: { ...product[0], variants },
      reviews,
    });
  } catch (err) {
    return handleApiError(err);
  }
}