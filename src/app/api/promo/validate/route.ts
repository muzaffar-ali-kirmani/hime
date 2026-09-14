export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { eq, and, gte, gt } from "drizzle-orm";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema_ = z.object({
  code: z.string().min(1).max(40),
  subtotalUsd: z.number().min(0).default(0),
});

export async function POST(req: Request) {
  try {
    // Code-guessing protection: 20 checks / 5 min per IP.
    const rl = rateLimit(`promo:${clientIp(req)}`, 20, 5 * 60_000);
    if (!rl.ok) {
      return apiError(`Too many attempts. Try again in ${rl.retryAfter}s`, 429);
    }

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