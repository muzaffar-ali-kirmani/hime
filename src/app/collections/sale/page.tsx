import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";

export const metadata = {
  title: "Sale — Lune",
};

export default function SalePage() {
  return (
    <ShopLayout>
      <ProductListing title="Sale" subtitle="Up to 20% off select pieces" />
    </ShopLayout>
  );
}