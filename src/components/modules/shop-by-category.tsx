"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/data";
import { useLocale } from "@/lib/locale-provider";

const ACTIVE_CATEGORIES = [
  CATEGORIES.find((c) => c.id === "necklaces")!,
  CATEGORIES.find((c) => c.id === "bracelets")!,
  CATEGORIES.find((c) => c.id === "rings")!,
  // Earrings and Anklets hidden for now — re-enable here to restore them
] as const;

export function ShopByCategoryModule() {
  const { language } = useLocale();
  return (
    <section className="container-wide py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          Shop by Category
        </p>
        <h2 className="mt-2 font-serif text-4xl text-navy sm:text-5xl">
          Find her something
        </h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {ACTIVE_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                  <p className="font-serif text-xl text-cream">
                    {language === "ar" ? c.nameAr : c.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}