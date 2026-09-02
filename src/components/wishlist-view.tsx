"use client";

import Link from "next/link";
import { useStore } from "@/lib/store-provider";
import { ProductCard } from "@/components/product-card";
import { getProduct } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function WishlistView() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as ReturnType<typeof getProduct>[];

  return (
    <section className="container-wide py-10 lg:py-14">
      <h1 className="font-serif text-4xl text-navy sm:text-5xl">Wishlist</h1>
      <p className="mt-2 text-sm text-navy/60">{items.length} pieces saved</p>

      {items.length === 0 ? (
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
          {items.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}