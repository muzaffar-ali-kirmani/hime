import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";

export const metadata = {
  title: "Shop All — Hime",
  description: "Explore all personalised jewellery pieces.",
};

export default function ShopAllPage() {
  return (
    <ShopLayout>
      <ProductListing title="Shop All" subtitle="The full collection" />
    </ShopLayout>
  );
}