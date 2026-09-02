import { ShopLayout } from "@/components/shop-layout";
import { Customizer } from "@/components/customizer";

export const metadata = {
  title: "Create Your Own — Lune",
  description:
    "Design a piece of jewellery just for her. Choose metal, length, engraving, birthstone and charms.",
};

export default function CustomizePage() {
  return (
    <ShopLayout>
      <Customizer />
    </ShopLayout>
  );
}