"use client";

import Link from "next/link";
import { Crown, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JewelleryClubModule() {
  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="grid items-center gap-8 rounded-[2rem] bg-gradient-to-br from-sand to-blush p-8 sm:p-12 lg:grid-cols-2 lg:gap-12 lg:p-16">
        <div className="space-y-5 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
            <Crown className="size-3" /> Lune Jewellery Club
          </span>
          <h2 className="font-serif text-4xl text-navy sm:text-5xl">
            Join the inner circle.
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-navy/75 lg:mx-0">
            Members earn 1.5× points on every order, get first access to new
            collections, complimentary engraving on every piece, and a birthday
            gift from us.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Button
              asChild
              className="rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              <Link href="/club">Join Free</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-xs uppercase tracking-widest text-navy hover:bg-navy/5"
            >
              <Link href="/club">Learn more</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Sparkles, title: "1.5× points", desc: "On every order" },
            { icon: Gift, title: "Birthday gift", desc: "A piece, on us" },
            { icon: Crown, title: "Early access", desc: "To new drops" },
            { icon: Sparkles, title: "Free engraving", desc: "Always included" },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 text-center"
            >
              <b.icon className="mx-auto size-5 text-gold" />
              <p className="mt-3 font-serif text-lg text-navy">{b.title}</p>
              <p className="text-xs text-navy/60">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}