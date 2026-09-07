export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  amount: z.number().min(0.5).optional(),
  minOrderUsd: z.number().min(0).optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await requireAdmin();
    const { code } = await params;
    const body = await req.json();
    const data = patchSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.isActive !== undefined) update.isActive = data.isActive;
    if (data.amount !== undefined) update.amount = data.amount;
    if (data.minOrderUsd !== undefined) update.minOrderUsd = data.minOrderUsd;
    if (data.expiresAt !== undefined)
      update.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    if (Object.keys(update).length === 0) {
      return apiError("Nothing to update", 400);
    }

    const result = await db
      .update(schema.promoCodes)
      .set(update)
      .where(eq(schema.promoCodes.code, code.toUpperCase()))
      .returning({ code: schema.promoCodes.code });

    if (result.length === 0) {
      return apiError("Promo code not found", 404);
    }

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await requireAdmin();
    const { code } = await params;
    const result = await db
      .delete(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code.toUpperCase()))
      .returning({ code: schema.promoCodes.code });

    if (result.length === 0) {
      return apiError("Promo code not found", 404);
    }
    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
