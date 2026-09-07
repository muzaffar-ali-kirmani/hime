import { ShopLayout } from "@/components/shop-layout";
import { Customizer } from "@/components/customizer";

export const metadata = {
  title: "Create Your Own — Hime",
  description:
    "Design a piece of jewellery just for her. Choose the metal, length and engraving — hand-finished to order."
};

export default function CustomizePage() {
  return (
    <ShopLayout>
      <Customizer />
    </ShopLayout>
  );
}