import { ShopLayout } from "@/components/shop-layout";
import { OrderView } from "@/components/order-view";

export const metadata = {
  title: "Order — Hime",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return (
    <ShopLayout>
      <OrderView orderNumber={orderNumber} />
    </ShopLayout>
  );
}