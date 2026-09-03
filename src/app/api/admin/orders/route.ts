export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { eq, desc, type SQL } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = Number(url.searchParams.get("limit") || "50");

    const conditions: SQL[] = [];
    if (status) {
      conditions.push(eq(schema.orders.status, status));
    }

    const orders = await db
      .select()
      .from(schema.orders)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(schema.orders.createdAt))
      .limit(limit);

    return apiSuccess({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}