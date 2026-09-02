import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";
import { FEATURED_COLLECTIONS, PRODUCTS } from "@/lib/data";

export const metadata = {
  title: "New & Trending — Lune",
};

export default function NewCollectionPage() {
  const newArrivals = FEATURED_COLLECTIONS[0].productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  return (
    <ShopLayout>
      <ProductListing
        initialCategory="all"
        title="New & Trending"
        subtitle="Just landed, just made for you"
      />
    </ShopLayout>
  );
}