import { db, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { eq, and, or } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const user = await getCurrentUser();

    const order = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.orderNumber, orderNumber))
      .limit(1);

    if (order.length === 0) {
      return apiError("Order not found", 404);
    }

    // Authorization: must be owner or match guest email
    if (order[0].userId) {
      if (!user || user.id !== order[0].userId) {
        return apiError("Not authorized", 403);
      }
    }

    const items = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order[0].id));

    return apiSuccess({ order: order[0], items });
  } catch (err) {
    return handleApiError(err);
  }
}