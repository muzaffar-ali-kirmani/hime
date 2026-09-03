"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-provider";

export function HeroModule() {
  const { t, language } = useLocale();
  const isAr = language === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-sand to-blush">
      <div className="container-wide grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div className="space-y-5 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-gold" /> Eid Collection 2026
          </span>
          <h1 className="font-serif text-5xl font-light leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
            <span className="block text-balance">
              {isAr ? "صُنع من" : "Just made"}
            </span>
            <span className="block italic text-gold">
              {isAr ? "أجلكِ فقط" : "for you."}
            </span>
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-navy/75 lg:mx-0 lg:text-lg">
            {isAr
              ? "مجوهرات شخصية مصنوعة يدويًا من الذهب عيار 18 والفضة الاسترلينية. صمّمي قطعة تحمل قصتها."
              : "Hand-finished personalised jewellery in 18K gold and 925 sterling silver. Crafted to carry her name, her story."}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
            <Button
              asChild
              className="rounded-full bg-navy px-7 py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              <Link href="/customize">
                {t("create.your.own")} <ArrowRight className="ms-2 size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-full px-7 py-6 text-xs uppercase tracking-widest text-navy hover:bg-navy/5"
            >
              <Link href="/shop">{t("shop.now")}</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-5 pt-3 text-[10px] uppercase tracking-widest text-navy/55 lg:justify-start">
            <span className="flex items-center gap-1.5">✦ 18K Hallmarked</span>
            <span className="flex items-center gap-1.5">✦ Free Gulf Shipping</span>
            <span className="hidden items-center gap-1.5 sm:flex">✦ 30-day Returns</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgba(29,42,68,0.25)]">
            <Image
              src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23F7F3EB'/%3E%3Cstop offset='1' stop-color='%23EADBD3'/%3E%3C/linearGradient%3E%3CradialGradient id='r' cx='0.5' cy='0.4'%3E%3Cstop offset='0' stop-color='%23E8D9B8'/%3E%3Cstop offset='1' stop-color='%23A88A4D'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='600' height='750' fill='url(%23g)'/%3E%3Ccircle cx='300' cy='280' r='80' fill='url(%23r)'/%3E%3Cpath d='M 300 360 L 320 410 L 360 410 L 330 440 L 340 490 L 300 460 L 260 490 L 270 440 L 240 410 L 280 410 Z' fill='%23C9A66B'/%3E%3Ctext x='300' y='600' font-family='Cormorant Garamond' font-size='42' fill='%231D2A44' text-anchor='middle' font-style='italic'%3EA%3C/text%3E%3Ctext x='300' y='650' font-family='Inter' font-size='12' fill='%231D2A44' text-anchor='middle' letter-spacing='6' opacity='0.5'%3ECELESTE%3C/text%3E%3C/svg%3E"
              alt="Hero jewellery piece"
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>
          {/* Floating accent */}
        </div>
      </div>
    </section>
  );
}