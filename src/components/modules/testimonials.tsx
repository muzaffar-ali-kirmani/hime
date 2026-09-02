"use client";

import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS } from "@/lib/data";

export function TestimonialsModule() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActive(i);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    scrollerRef.current?.scrollTo({
      left: i * (scrollerRef.current?.clientWidth || 0),
      behavior: "smooth",
    });
  };

  return (
    <section className="container-wide py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          Loved Across the Gulf
        </p>
        <h2 className="mt-2 font-serif text-4xl text-navy sm:text-5xl">
          Words from our women.
        </h2>
      </div>
      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-4"
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="w-full shrink-0 snap-center px-4 sm:w-[60%] lg:w-[40%]"
          >
            <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-gold stroke-gold" />
                ))}
              </div>
              <p className="mt-4 font-serif text-xl leading-snug text-navy">
                "{t.text}"
              </p>
              <div className="mt-6 border-t border-border pt-4 text-xs">
                <p className="font-medium text-navy">{t.name}</p>
                <p className="text-navy/60">{t.location}</p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-gold">
                  On {t.product}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => scrollTo(Math.max(0, active - 1))}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-6 bg-gold" : "w-1.5 bg-navy/20"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => scrollTo(Math.min(TESTIMONIALS.length - 1, active + 1))}
          aria-label="Next testimonial"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}