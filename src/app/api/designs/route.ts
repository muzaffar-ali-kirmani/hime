import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq, and, desc } from "drizzle-orm";

const designSchema = z.object({
  productId: z.string().nullable().optional(),
  productName: z.string().min(1),
  config: z.record(z.string(), z.string()),
});

export async function GET() {
  try {
    const user = await requireUser();
    const designs = await db
      .select()
      .from(schema.savedDesigns)
      .where(eq(schema.savedDesigns.userId, user.id))
      .orderBy(desc(schema.savedDesigns.createdAt))
      .limit(50);

    return apiSuccess({ designs });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = designSchema.parse(body);

    const id = generateId("des");
    await db.insert(schema.savedDesigns).values({
      id,
      userId: user.id,
      productId: data.productId || null,
      productName: data.productName,
      config: data.config,
    });

    return apiSuccess({ id }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return apiSuccess({ success: true });

    await db
      .delete(schema.savedDesigns)
      .where(
        and(
          eq(schema.savedDesigns.id, id),
          eq(schema.savedDesigns.userId, user.id)
        )
      );

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}