import { db, schema } from "@/lib/db";
import { eq, and, desc, asc, like, gte, lte, inArray, sql } from "drizzle-orm";
import { apiSuccess, handleApiError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const metal = url.searchParams.get("metal");
    const occasion = url.searchParams.get("occasion");
    const personalizeOnly = url.searchParams.get("personalize") === "true";
    const badge = url.searchParams.get("badge");
    const minPrice = url.searchParams.get("min");
    const maxPrice = url.searchParams.get("max");
    const sort = url.searchParams.get("sort") || "featured";
    const search = url.searchParams.get("q");
    const limit = Number(url.searchParams.get("limit") || "50");
    const offset = Number(url.searchParams.get("offset") || "0");

    const conditions = [eq(schema.products.isActive, true)];

    if (category) {
      conditions.push(eq(schema.products.category, category));
    }
    if (badge) {
      conditions.push(eq(schema.products.badge, badge));
    }
    if (minPrice) {
      conditions.push(gte(schema.products.basePrice, Number(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(schema.products.basePrice, Number(maxPrice)));
    }
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      conditions.push(like(sql`lower(${schema.products.name})`, term));
    }
    if (personalizeOnly) {
      conditions.push(sql`${schema.products.personalization} IS NOT NULL AND ${schema.products.personalization} != '{}'`);
    }

    let products = await db
      .select()
      .from(schema.products)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Fetch variants for all products
    const productIds = products.map((p) => p.id);
    let variants: typeof schema.productVariants.$inferSelect[] = [];
    if (productIds.length > 0) {
      variants = await db
        .select()
        .from(schema.productVariants)
        .where(inArray(schema.productVariants.productId, productIds));
    }

    // Filter by metal (any variant matches)
    if (metal) {
      const productIdsForMetal = new Set(
        variants.filter((v) => v.metal === metal).map((v) => v.productId)
      );
      products = products.filter((p) => productIdsForMetal.has(p.id));
    }

    // Filter by occasion
    if (occasion) {
      products = products.filter((p) => {
        const occ = (p.occasion as string[] | null) || [];
        return occ.includes(occasion);
      });
    }

    // Sort
    if (sort === "price-asc") {
      products.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sort === "newest") {
      products.sort(
        (a, b) =>
          (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0)
      );
    }

    // Group variants by product
    const variantsByProduct = new Map<string, typeof variants>();
    for (const v of variants) {
      if (!variantsByProduct.has(v.productId)) {
        variantsByProduct.set(v.productId, []);
      }
      variantsByProduct.get(v.productId)!.push(v);
    }

    return apiSuccess({
      products: products.map((p) => ({
        ...p,
        variants: variantsByProduct.get(p.id) || [],
      })),
      total: products.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}