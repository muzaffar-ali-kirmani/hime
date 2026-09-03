export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.userId, user.id))
      .orderBy(desc(schema.orders.createdAt));

    if (orders.length === 0) {
      return apiSuccess({ orders: [] });
    }

    const orderIds = orders.map((o) => o.id);
    const allItems = await db
      .select()
      .from(schema.orderItems)
      .where(inArray(schema.orderItems.orderId, orderIds));

    return apiSuccess({
      orders: orders.map((o) => ({
        ...o,
        items: allItems.filter((i) => i.orderId === o.id),
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}