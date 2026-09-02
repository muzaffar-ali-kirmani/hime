import { ShopLayout } from "@/components/shop-layout";
import { ProductListing } from "@/components/product-listing";
import { Gift, Sparkles } from "lucide-react";

export const metadata = {
  title: "Gifting — Lune",
};

export default function GiftingPage() {
  return (
    <ShopLayout>
      <section className="container-wide pt-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: Sparkles, title: "The Eid Edit", desc: "Pieces made to be wrapped" },
            { icon: Gift, title: "Gift Cards", desc: "Let her choose" },
          ].map((b, i) => (
            <a
              key={i}
              href="#"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="rounded-full bg-gold/15 p-3">
                <b.icon className="size-6 text-gold" />
              </div>
              <div>
                <p className="font-serif text-xl text-navy">{b.title}</p>
                <p className="text-sm text-navy/60">{b.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <ProductListing
        title="Gifting"
        subtitle="Make it meaningful"
      />
    </ShopLayout>
  );
}