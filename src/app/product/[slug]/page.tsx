import { notFound } from "next/navigation";
import { ShopLayout } from "@/components/shop-layout";
import { ProductDetail } from "@/components/product-detail";
import { PRODUCTS, getProduct } from "@/lib/data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Lune" };
  return {
    title: `${product.name} — Lune`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <ShopLayout>
      <ProductDetail product={product} />
    </ShopLayout>
  );
}