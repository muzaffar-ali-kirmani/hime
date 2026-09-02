import { Award, Truck, RefreshCcw, Heart, Sparkles, Globe } from "lucide-react";
import { TRUST_BADGES } from "@/lib/data";

const ICONS = [Award, Sparkles, Heart, Truck, RefreshCcw, Globe];

export function WhyShopWithUsModule() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="container-wide">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Why Lune
          </p>
          <h2 className="mt-2 font-serif text-4xl text-navy sm:text-5xl">
            Made with care, made to last.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_BADGES.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
              >
                <Icon className="size-7 text-gold" strokeWidth={1.2} />
                <h3 className="mt-4 font-serif text-xl text-navy">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}