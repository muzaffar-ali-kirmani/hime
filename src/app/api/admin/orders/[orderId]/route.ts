export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { eq } from "drizzle-orm";

const updateSchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "in_production",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();
    const { orderId } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    await db
      .update(schema.orders)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId));

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();
    const { orderId } = await params;
    const order = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return apiSuccess({ order: null, items: [] });
    }

    const items = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, orderId));

    return apiSuccess({ order: order[0], items });
  } catch (err) {
    return handleApiError(err);
  }
}