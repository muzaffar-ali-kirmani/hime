"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-provider";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function WishlistView() {
  const { wishlist } = useStore();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (wishlist.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/products?limit=100");
        const json = await res.json();
        if (cancelled) return;
        const all: Product[] = json.products || [];
        const byId = new Map(all.map((p) => [p.id, p]));
        // Preserve the order in which items were wishlisted.
        setItems(
          wishlist.map((id) => byId.get(id)).filter(Boolean) as Product[]
        );
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  return (
    <section className="container-wide py-10 lg:py-14">
      <h1 className="font-serif text-4xl text-navy sm:text-5xl">Wishlist</h1>
      <p className="mt-2 text-sm text-navy/60">{items.length} pieces saved</p>

      {loading ? (
        <p className="mt-10 text-sm text-navy/60">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-20 text-center">
          <p className="font-serif text-2xl text-navy">No favourites yet</p>
          <p className="max-w-sm text-sm text-navy/60">
            Tap the heart on any piece to save it for later.
          </p>
          <Button
            asChild
            className="mt-2 rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
          >
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}