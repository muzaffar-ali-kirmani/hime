import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq, and, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.email.endsWith("@hime.jewellery")) {
    throw new Error("Admin access required");
  }
  return user;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = Number(url.searchParams.get("limit") || "50");

    let query = db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(limit);

    if (status) {
      query = db
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.status, status))
        .orderBy(desc(schema.orders.createdAt))
        .limit(limit);
    }

    const orders = await query;
    return apiSuccess({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}