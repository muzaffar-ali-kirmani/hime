import { ShopLayout } from "@/components/shop-layout";
import { WishlistView } from "@/components/wishlist-view";

export const metadata = {
  title: "Wishlist — Lune",
};

export default function WishlistPage() {
  return (
    <ShopLayout>
      <WishlistView />
    </ShopLayout>
  );
}