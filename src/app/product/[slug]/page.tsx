import { notFound } from "next/navigation";
import { ShopLayout } from "@/components/shop-layout";
import { ProductDetail } from "@/components/product-detail";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import type { Product } from "@/lib/types";

// DB-backed product page
export const dynamic = "force-dynamic";

async function getProductBySlug(slug: string) {
  const product = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.slug, slug), eq(schema.products.isActive, true)))
    .limit(1);

  if (product.length === 0) return null;

  const variants = await db
    .select()
    .from(schema.productVariants)
    .where(eq(schema.productVariants.productId, product[0].id));

  return { ...product[0], variants } as unknown as Product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Hime" };
  return {
    title: `${product.name} — Hime`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <ShopLayout>
      <ProductDetail product={product} />
    </ShopLayout>
  );
}