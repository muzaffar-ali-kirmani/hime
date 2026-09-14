export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq, and, sql, desc } from "drizzle-orm";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10).max(2000),
  authorName: z.string().min(1).max(80),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const limit = Number(url.searchParams.get("limit") || "20");
    const offset = Number(url.searchParams.get("offset") || "0");

    if (!productId) {
      return apiError("productId required", 400);
    }

    // Only show approved reviews publicly.
    const reviews = await db
      .select()
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.productId, productId),
          eq(schema.reviews.isApproved, true)
        )
      )
      .orderBy(desc(schema.reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return apiSuccess({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    // SECURITY: reviews require an account (prevents anonymous rating spam).
    const user = await requireUser();

    // One review per user per product.
    const existing = await db
      .select({ id: schema.reviews.id })
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.productId, data.productId),
          eq(schema.reviews.userId, user.id)
        )
      )
      .limit(1);
    if (existing.length > 0) {
      return apiError("You have already reviewed this product", 409);
    }

    // Basic per-user rate limit: max 5 reviews per hour.
    const recent = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.userId, user.id),
          sql`${schema.reviews.createdAt} >= now() - interval '1 hour'`
        )
      );
    if ((recent[0]?.count || 0) >= 5) {
      return apiError("Too many reviews submitted — try again later", 429);
    }

    const id = generateId("rev");
    await db.insert(schema.reviews).values({
      id,
      productId: data.productId,
      userId: user.id,
      authorName: data.authorName,
      rating: data.rating,
      title: data.title || null,
      body: data.body,
      isVerified: true,
      // Held for moderation before becoming public.
      isApproved: false,
    });

    // Recalculate product rating from APPROVED reviews only.
    const stats = await db
      .select({
        avg: sql<number>`avg(${schema.reviews.rating})`.as("avg"),
        count: sql<number>`count(*)`.as("count"),
      })
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.productId, data.productId),
          eq(schema.reviews.isApproved, true)
        )
      );

    if (stats.length > 0) {
      await db
        .update(schema.products)
        .set({
          rating: Number(stats[0].avg.toFixed(2)),
          reviewCount: stats[0].count,
        })
        .where(eq(schema.products.id, data.productId));
    }

    return apiSuccess({ id }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}