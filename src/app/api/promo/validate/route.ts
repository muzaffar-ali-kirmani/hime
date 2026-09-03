export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { eq, and, gte, gt } from "drizzle-orm";

const schema_ = z.object({
  code: z.string().min(1).max(40),
  subtotalUsd: z.number().min(0).default(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema_.parse(body);

    const code = data.code.toUpperCase().trim();
    const promo = await db
      .select()
      .from(schema.promoCodes)
      .where(
        and(
          eq(schema.promoCodes.code, code),
          eq(schema.promoCodes.isActive, true)
        )
      )
      .limit(1);

    if (promo.length === 0) {
      return apiError("Invalid promo code", 404);
    }

    const p = promo[0];
    if (p.expiresAt && p.expiresAt < new Date()) {
      return apiError("This code has expired", 410);
    }
    if (data.subtotalUsd < p.minOrderUsd) {
      return apiError(`Minimum order ${p.minOrderUsd} USD required`, 400);
    }

    const discount =
      p.type === "percent" ? data.subtotalUsd * (p.amount / 100) : p.amount;

    return apiSuccess({
      code: p.code,
      type: p.type,
      amount: p.amount,
      discount,
      minOrderUsd: p.minOrderUsd,
    });
  } catch (err) {
    return handleApiError(err);
  }
}