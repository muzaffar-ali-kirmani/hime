import { ShopLayout } from "@/components/shop-layout";
import { Gift, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Gift Cards — Hime",
};

export default function GiftCardsPage() {
  const amounts = [50, 100, 150, 250, 500];
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Gifting
            </p>
            <h1 className="font-serif text-5xl text-navy">A gift, on her terms.</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/75">
              Not sure what to choose? A Hime gift card lets her pick exactly
              what she wants — even a custom-designed piece. Delivered
              instantly by email or WhatsApp.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {amounts.map((a) => (
                <button
                  key={a}
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm text-navy transition-all hover:border-navy"
                >
                  ${a}
                </button>
              ))}
            </div>
            <Button className="mt-6 rounded-full bg-navy px-8 py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90">
              <Gift className="me-2 size-4" /> Buy gift card
            </Button>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-cream to-sand p-8">
            <div className="aspect-[3/2] rounded-2xl bg-navy p-6 text-cream shadow-xl">
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Lune Gift Card
              </p>
              <p className="mt-3 font-serif text-3xl">$150</p>
              <p className="mt-auto pt-12 font-mono text-xs opacity-70">
                LUNE · 9F23A1 · VALID 24 MONTHS
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-navy/75">
              <li className="flex gap-2">
                <Sparkles className="size-4 text-gold" /> Redeemable on any product,
                including custom pieces
              </li>
              <li className="flex gap-2">
                <Mail className="size-4 text-gold" /> Delivered by email or WhatsApp
                instantly
              </li>
              <li className="flex gap-2">
                <Gift className="size-4 text-gold" /> Add a personal message at
                checkout
              </li>
            </ul>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}