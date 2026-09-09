import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { HeroModule } from "@/components/modules/hero";
import { ShopByCategoryModule } from "@/components/modules/shop-by-category";
import { CreateYourOwnModule } from "@/components/modules/create-your-own";
import { ProductCarousel } from "@/components/modules/product-carousel";
import { DbProductCarousel } from "@/components/modules/db-product-carousel";
import { JewelleryClubModule } from "@/components/modules/jewellery-club";
import { WhyShopWithUsModule } from "@/components/modules/why-shop";
import { TestimonialsModule } from "@/components/modules/testimonials";
import { InstagramModule } from "@/components/modules/instagram";
import { NewsletterModule } from "@/components/modules/newsletter";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroModule />
        <ShopByCategoryModule />
        <DbProductCarousel
          title="New Arrivals"
          subtitle="Just landed"
          badge="new"
        />
        {/* Hidden for now — re-enable to bring back the customizer module
        <CreateYourOwnModule /> */}
        <DbProductCarousel
          title="Best Sellers"
          subtitle="Loved across the Gulf"
          badge="bestseller"
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