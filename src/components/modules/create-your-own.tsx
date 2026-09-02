"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateYourOwnModule() {
  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center sm:px-12 sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl space-y-5">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
            <Sparkles className="size-3" /> Made Just For Her
          </div>
          <h2 className="font-serif text-4xl font-light leading-tight text-cream sm:text-6xl">
            Design a piece
            <br />
            <span className="italic text-gold">that's uniquely hers.</span>
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
            Choose the metal, the length, the gemstone. Engrave her initial,
            her name, her secret message. We hand-finish it in 5–7 days.
          </p>
          <Button
            asChild
            className="rounded-full bg-gold px-8 py-6 text-xs uppercase tracking-widest text-navy hover:bg-gold/90"
          >
            <Link href="/customize">
              Start Creating <ArrowRight className="ms-2 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}