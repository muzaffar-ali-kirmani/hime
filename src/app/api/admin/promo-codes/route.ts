export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

const createSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, dashes only"),
  type: z.enum(["percent", "fixed"]),
  amount: z.number().min(0.5),
  minOrderUsd: z.number().min(0).default(0),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const promoCodes = await db
      .select()
      .from(schema.promoCodes)
      .orderBy(desc(schema.promoCodes.isActive), schema.promoCodes.code);
    return apiSuccess({ promoCodes });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = createSchema.parse(body);

    // Code is always set by the admin
    const code = data.code.toUpperCase().trim();

    const existing = await db
      .select({ code: schema.promoCodes.code })
      .from(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code))
      .limit(1);
    if (existing.length > 0) {
      return apiError(`Code "${code}" already exists`, 409);
    }

    if (data.type === "percent" && data.amount > 100) {
      return apiError("Percent discount cannot exceed 100", 422);
    }

    const id = `promo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    await db.insert(schema.promoCodes).values({
      code,
      type: data.type,
      amount: data.amount,
      minOrderUsd: data.minOrderUsd,
      isActive: true,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    });

    return apiSuccess({ id, code }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
