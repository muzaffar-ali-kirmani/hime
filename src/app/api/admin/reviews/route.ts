export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await db
      .select()
      .from(schema.reviews)
      .orderBy(desc(schema.reviews.createdAt));
    return apiSuccess({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}
