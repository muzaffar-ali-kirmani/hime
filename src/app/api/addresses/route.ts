import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { apiSuccess, generateId, handleApiError } from "@/lib/api";
import { eq, and } from "drizzle-orm";

const addressSchema = z.object({
  label: z.string().min(1).max(40),
  name: z.string().min(1).max(80),
  phone: z.string().min(5),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  area: z.string().optional(),
  country: z.string().length(2),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  try {
    const user = await requireUser();
    const addresses = await db
      .select()
      .from(schema.addresses)
      .where(eq(schema.addresses.userId, user.id));

    return apiSuccess({ addresses });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = addressSchema.parse(body);

    const id = generateId("addr");

    if (data.isDefault) {
      await db
        .update(schema.addresses)
        .set({ isDefault: false })
        .where(eq(schema.addresses.userId, user.id));
    }

    await db.insert(schema.addresses).values({
      id,
      userId: user.id,
      ...data,
      address2: data.address2 || null,
      area: data.area || null,
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
      .delete(schema.addresses)
      .where(
        and(eq(schema.addresses.id, id), eq(schema.addresses.userId, user.id))
      );

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}