export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { desc } from "drizzle-orm";

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
    const reviews = await db
      .select()
      .from(schema.reviews)
      .orderBy(desc(schema.reviews.createdAt));
    return apiSuccess({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}
