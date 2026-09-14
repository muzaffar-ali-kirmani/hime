export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

const updateSchema = z.object({
  isApproved: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await db
      .select()
      .from(schema.reviews)
      .orderBy(desc(schema.reviews.createdAt));
    return apiSuccess({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    await db
      .update(schema.reviews)
      .set(data)
      .where(eq(schema.reviews.id, id));

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.delete(schema.reviews).where(eq(schema.reviews.id, id));
    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}