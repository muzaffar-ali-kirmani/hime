export const runtime = "nodejs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { apiSuccess, generateId, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

const sectionSchema = z.object({
  sectionKey: z.string(),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function GET() {
  try {
    const sections = await db
      .select()
      .from(schema.homepageSections)
      .orderBy(asc(schema.homepageSections.sortOrder));
    return apiSuccess({ sections });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = sectionSchema.parse(body);

    const existing = await db
      .select()
      .from(schema.homepageSections)
      .where(eq(schema.homepageSections.sectionKey, data.sectionKey))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(schema.homepageSections)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.homepageSections.id, existing[0].id));
      return apiSuccess({ id: existing[0].id });
    }

    const id = generateId("sec");
    await db.insert(schema.homepageSections).values({ id, ...data });
    return apiSuccess({ id }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}