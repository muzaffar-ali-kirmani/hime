import { notFound } from "next/navigation";
import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";
import { CATEGORIES } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);
  if (!category) return { title: "Lune" };
  return {
    title: `${category.name} — Lune`,
    description: `Shop our ${category.name.toLowerCase()} collection.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);
  if (!category) notFound();

  return (
    <ShopLayout>
      <ProductListing
        initialCategory={slug}
        title={category.name}
        subtitle={category.nameAr}
      />
    </ShopLayout>
  );
}