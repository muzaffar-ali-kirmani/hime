export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

const updateSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "in_production",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user.email.endsWith("@hime.jewellery")) {
      return apiError("Admin access required", 403);
    }

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