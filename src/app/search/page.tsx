"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { ShopLayout } from "@/components/shop-layout";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { Button } from "@/components/ui/button";

const POPULAR = ["Initial necklace", "Birthstone ring", "Pearl earrings", "Gold bracelet"];

export default function SearchPage() {
  const { currency, language } = useLocale();
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load the live catalogue once; filtering happens client-side below.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        const json = await res.json();
        if (!cancelled) setAllProducts(json.products || []);
      } catch {
        if (!cancelled) setAllProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-16">
        <h1 className="mb-2 font-serif text-4xl text-navy sm:text-5xl">Search</h1>
        <p className="mb-6 text-sm text-navy/60">
          Looking for something specific? Try a name, category, or material.
        </p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-5 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search necklaces, bracelets…"
            className="h-14 rounded-full pl-12 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {!query && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-widest text-navy/60">
              Popular searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => setQuery(p)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-navy hover:border-navy"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div className="mt-10">
            <p className="mb-4 text-sm text-navy/60">
              {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
            </p>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="font-serif text-2xl text-navy">No matches</p>
                <p className="mt-2 text-sm text-navy/60">
                  Try a broader search, or browse our categories.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 rounded-full"
                >
                  <Link href="/shop">Browse shop</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:border-navy"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy">
                        {p.name}
                      </p>
                      <p className="text-xs text-navy/60">
                        {formatPrice(p.basePrice, currency, language)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </ShopLayout>
  );
}