export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const users = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        phone: schema.users.phone,
        country: schema.users.country,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt));
    return apiSuccess({ users });
  } catch (err) {
    return handleApiError(err);
  }
}