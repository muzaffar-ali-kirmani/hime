"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-provider";

export function HeroModule() {
  const { t, language } = useLocale();
  const isAr = language === "ar";

  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Full-bleed campaign image */}
      <div className="absolute inset-0">
        <Image
          src="/bg-image.jpeg"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-[20%_center] lg:object-center"
        />
        {/* Legibility veil: lifts the silky right side toward cream so text sits cleanly */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-cream/20 to-cream/70 lg:block" />
        {/* Mobile: darken overall so centered text stays readable */}
        <div className="absolute inset-0 bg-navy/45 lg:hidden" />
        {/* Fade into the page background below */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-cream" />
      </div>

      <div className="container-wide relative flex min-h-[78vh] items-end py-14 lg:min-h-[86vh] lg:items-center lg:justify-end lg:py-20">
        <div className="w-full max-w-xl rounded-3xl border border-navy/10 bg-cream/80 p-8 text-center shadow-[0_30px_80px_-30px_rgba(29,42,68,0.35)] backdrop-blur-md lg:bg-cream/70 lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
            <span className="h-1 w-1 rounded-full bg-gold" /> New Arrival
          </span>

          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
            <span className="block text-balance">
              {isAr ? "صُنع من" : "Just made"}
            </span>
            <span className="block italic text-gold">
              {isAr ? "أجلكِ فقط" : "for you."}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-navy/75 lg:mx-0 lg:ml-auto lg:text-lg">
            {isAr
              ? "مجوهرات شخصية مصنوعة يدويًا من الذهب عيار 18 والفضة الاسترلينية. صمّمي قطعة تحمل قصتها."
              : "Hand-finished personalised jewellery gold plated and stainless steel. Crafted to carry her name, her story."}
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-end">
            <Button
              asChild
              className="rounded-full bg-navy px-8 py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              <Link href="/shop">{t("shop.now")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-navy/30 bg-transparent px-8 py-6 text-xs uppercase tracking-widest text-navy hover:bg-navy hover:text-cream"
            >
              <Link href="/collections/new">{isAr ? "وصل حديثًا" : "New & Trending"}</Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-[10px] uppercase tracking-widest text-navy/55 lg:justify-end">
            <span className="flex items-center gap-1.5">✦ {isAr ? "توصيل مجاني لدول الخليج" : "Free Gulf Shipping"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}