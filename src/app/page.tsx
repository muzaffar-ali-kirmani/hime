import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { HeroModule } from "@/components/modules/hero";
import { ShopByCategoryModule } from "@/components/modules/shop-by-category";
import { CreateYourOwnModule } from "@/components/modules/create-your-own";
import { ProductCarousel } from "@/components/modules/product-carousel";
import { JewelleryClubModule } from "@/components/modules/jewellery-club";
import { WhyShopWithUsModule } from "@/components/modules/why-shop";
import { TestimonialsModule } from "@/components/modules/testimonials";
import { InstagramModule } from "@/components/modules/instagram";
import { NewsletterModule } from "@/components/modules/newsletter";
import { FEATURED_COLLECTIONS, PRODUCTS } from "@/lib/data";

export default function HomePage() {
  const newArrivals = FEATURED_COLLECTIONS[0].productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;
  const bestSellers = FEATURED_COLLECTIONS[1].productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroModule />
        <ShopByCategoryModule />
        <ProductCarousel
          title="New Arrivals"
          subtitle="Just landed"
          products={newArrivals}
        />
        <CreateYourOwnModule />
        <ProductCarousel
          title="Best Sellers"
          subtitle="Loved across the Gulf"
          products={bestSellers}
          showQuickAdd
        />
        <JewelleryClubModule />
        <WhyShopWithUsModule />
        <TestimonialsModule />
        <InstagramModule />
        <NewsletterModule />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}