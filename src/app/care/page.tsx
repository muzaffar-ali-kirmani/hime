import { ShopLayout } from "@/components/shop-layout";
import { Sparkles, Droplets, Shield } from "lucide-react";

export const metadata = {
  title: "Jewellery Care — Hime",
};

export default function CarePage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Care
          </p>
          <h1 className="font-serif text-5xl text-navy">Keep it shining</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy/65">
            A few small habits will keep your Hime piece looking brand new
            for years to come.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Droplets,
              title: "Keep it dry",
              text: "Remove your jewellery before showering, swimming or exercising. Water, chlorine and salt accelerate tarnish.",
            },
            {
              icon: Sparkles,
              title: "Last on, first off",
              text: "Apply perfume, lotion and hairspray before putting on your jewellery. Put your jewellery on last, take it off first.",
            },
            {
              icon: Shield,
              title: "Store with care",
              text: "Keep each piece in its original pouch, away from direct sunlight. Chains should be laid flat to prevent tangling.",
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

        <div className="mx-auto mt-14 max-w-3xl space-y-6 text-sm leading-relaxed text-navy/80">
          <h2 className="font-serif text-3xl text-navy">By material</h2>

          <Section title="18K Gold & Gold Vermeil">
            <p>
              Our solid 18K pieces need very little care — just a soft cloth
              and warm water. For gold vermeil (sterling silver coated with
              18K gold), avoid abrasive polishes which can wear the plating
              over time.
            </p>
          </Section>

          <Section title="925 Sterling Silver">
            <p>
              Silver naturally tarnishes when exposed to air. Polish gently
              with the included cloth. For deeper tarnish, use a mild
              silver-cleaning solution and rinse thoroughly.
            </p>
          </Section>

          <Section title="Gemstones & Pearls">
            <p>
              Wipe pearls with a soft, dry cloth after wear — never submerge
              them. Avoid contact with perfume, hairspray or lotion. Store
              pearls flat to prevent stretching the silk thread.
            </p>
          </Section>

          <Section title="Engraved pieces">
            <p>
              Our engravings are deep and permanent. Clean around the engraved
              area gently with a soft brush. Avoid harsh chemicals which can
              dull the polished surface around the engraving.
            </p>
          </Section>
        </div>
      </section>
    </ShopLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-serif text-xl text-navy">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}