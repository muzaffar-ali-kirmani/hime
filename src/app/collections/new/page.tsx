import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";

export const metadata = {
  title: "New & Trending — Hime",
};

export default function NewCollectionPage() {
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