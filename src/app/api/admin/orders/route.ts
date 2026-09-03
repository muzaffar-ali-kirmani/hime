export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { eq, desc, and, gte, lte, sql, type SQL } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
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
    const search = url.searchParams.get("q");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const limit = Number(url.searchParams.get("limit") || "100");

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(schema.orders.status, status));
    if (from) conditions.push(gte(schema.orders.createdAt, new Date(from)));
    if (to) conditions.push(lte(schema.orders.createdAt, new Date(to)));
    if (search) {
      conditions.push(sql`(${schema.orders.orderNumber} LIKE ${"%" + search + "%"} OR ${schema.orders.shippingName} LIKE ${"%" + search + "%"} OR ${schema.orders.shippingEmail} LIKE ${"%" + search + "%"} OR ${schema.orders.guestEmail} LIKE ${"%" + search + "%"})`);
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