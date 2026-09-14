export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { apiError, apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq } from "drizzle-orm";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const signupSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1).max(60).trim(),
  lastName: z.string().min(1).max(60).trim(),
  phone: z.string().optional(),
  country: z.string().length(2).optional(),
});

export async function POST(req: Request) {
  try {
    // Account-creation spam protection: 5 signups / hour per IP.
    const rl = rateLimit(`signup:${clientIp(req)}`, 5, 60 * 60_000);
    if (!rl.ok) {
      return apiError(`Too many attempts. Try again in ${rl.retryAfter}s`, 429);
    }

    const body = await req.json();
    const data = signupSchema.parse(body);

    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      return apiError("An account with this email already exists", 409);
    }

    const userId = generateId("usr");
    const passwordHash = await hashPassword(data.password);

    await db.insert(schema.users).values({
      id: userId,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      country: data.country || "AE",
    });

    await createSession(userId, data.email);

    return apiSuccess(
      {
        user: {
          id: userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
      201
    );
  } catch (err) {
    return handleApiError(err);
  }
}