export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { apiSuccess, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const result = await db
      .select({
        category: schema.products.category,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(schema.products)
      .where(eq(schema.products.isActive, true))
      .groupBy(schema.products.category);

    return apiSuccess({ categories: result });
  } catch (err) {
    return handleApiError(err);
  }
}