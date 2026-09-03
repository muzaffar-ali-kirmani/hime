import Link from "next/link";
import { Sparkles, Award, Leaf, Heart } from "lucide-react";
import { ShopLayout } from "@/components/shop-layout";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Our Story — Hime",
  description: "The story behind Hime — hand-finished personalised jewellery made for her.",
};

export default function AboutPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Our story
            </p>
            <h1 className="mt-2 font-serif text-5xl leading-[1.05] text-navy sm:text-6xl">
              Made for her story.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-navy/75">
              Hime was born out of a simple wish — that the women we love
              should wear something that carries a piece of them. We started
              in a small atelier between Dubai and Riyadh, hand-finishing
              engraved pendants for the women who matter most in our lives.
            </p>
            <p className="mt-3 text-base leading-relaxed text-navy/75">
              Today, every Hime piece is set and polished by hand in 18K
              gold or 925 sterling silver. We don't make fast jewellery —
              we make the kind you reach for every day. The kind you pass
              down.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
              >
                <Link href="/customize">Design a piece</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-xs uppercase tracking-widest text-navy"
              >
                <Link href="/shop">Shop the collection</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-sand to-blush">
              <div className="flex h-full items-center justify-center">
                <Sparkles className="size-20 text-gold/40" strokeWidth={1} />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-5 shadow-lg sm:block">
              <p className="font-serif text-3xl text-navy">5,000+</p>
              <p className="text-xs text-navy/60">Pieces hand-finished</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div id="craft" className="mt-24 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Award,
              title: "Craftsmanship",
              text: "Every piece is set, polished and inspected by hand in our atelier.",
            },
            {
              icon: Leaf,
              title: "Ethical sourcing",
              text: "We only work with recycled gold and silver, and conflict-free gemstones.",
            },
            {
              icon: Heart,
              title: "Made for her",
              text: "Designed for women, by women — for the moments that matter.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <v.icon className="size-7 text-gold" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-xl text-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-navy/65">{v.text}</p>
            </div>
          ))}
        </div>

        {/* Workshop story */}
        <div className="mt-24 rounded-3xl bg-gradient-to-br from-navy to-navy/90 px-8 py-14 text-center text-cream sm:px-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
            From the atelier
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl sm:text-5xl">
            "Every piece passes through seven hands before it reaches hers."
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/70">
            From wax carving to final polish, our master jewellers hand-finish
            every Lune piece. No two are exactly alike — and that's the point.
          </p>
        </div>
      </section>
    </ShopLayout>
  );
}