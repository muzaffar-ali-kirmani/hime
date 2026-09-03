import { ShopLayout } from "@/components/shop-layout";
import { Sparkles, Crown, Gift, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Hime Jewellery Club — Hime",
};

export default function ClubPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-navy to-navy/95 px-6 py-14 text-center text-cream sm:px-12 sm:py-16">
          <Crown className="mx-auto size-10 text-gold" strokeWidth={1.2} />
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl">
            The Hime Club
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
            Free to join. Earn points on every order, get first access to new
            drops, complimentary engraving, and a birthday gift from us.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-gold px-8 py-6 text-xs uppercase tracking-widest text-navy hover:bg-gold/90"
          >
            <Link href="/account">Join free</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Sparkles,
              title: "1.5× points",
              text: "Earn 1.5 points for every 1 USD spent. 100 points = 10 USD off.",
            },
            {
              icon: Crown,
              title: "Early access",
              text: "Shop new collections 48 hours before everyone else.",
            },
            {
              icon: Gift,
              title: "Birthday gift",
              text: "A surprise piece from us on your birthday.",
            },
            {
              icon: Truck,
              title: "Free shipping",
              text: "Free shipping on every order, no minimum.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <b.icon className="size-7 text-gold" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-xl text-navy">{b.title}</h3>
              <p className="mt-2 text-sm text-navy/65">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}