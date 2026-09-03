export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1);

    if (user.length === 0) {
      return apiError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(data.password, user[0].passwordHash);
    if (!valid) {
      return apiError("Invalid email or password", 401);
    }

    await createSession(user[0].id, user[0].email);

    return apiSuccess({
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}