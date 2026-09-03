export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
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

    const reviews = await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.productId, productId))
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

    const user = await getCurrentUser();

    const id = generateId("rev");
    await db.insert(schema.reviews).values({
      id,
      productId: data.productId,
      userId: user?.id || null,
      authorName: data.authorName,
      rating: data.rating,
      title: data.title || null,
      body: data.body,
      isVerified: !!user,
    });

    // Update product rating
    const stats = await db
      .select({
        avg: sql<number>`avg(${schema.reviews.rating})`.as("avg"),
        count: sql<number>`count(*)`.as("count"),
      })
      .from(schema.reviews)
      .where(eq(schema.reviews.productId, data.productId));

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