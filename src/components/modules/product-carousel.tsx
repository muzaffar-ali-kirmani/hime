"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

export function ProductCarousel({
  title,
  subtitle,
  products,
  showQuickAdd = true,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  showQuickAdd?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    const w = scrollerRef.current.clientWidth * 0.8;
    scrollerRef.current.scrollBy({
      left: dir === "left" ? -w : w,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          {subtitle && (
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              {subtitle}
            </p>
          )}
          <h2 className="font-serif text-3xl text-navy sm:text-4xl">{title}</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:gap-5"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[55%] shrink-0 snap-start sm:w-[32%] lg:w-[24%]"
          >
            <ProductCard product={p} showQuickAdd={showQuickAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}