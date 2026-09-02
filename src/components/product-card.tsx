"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Star } from "lucide-react";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  showQuickAdd = true,
}: {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const { currency, language } = useLocale();
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = product.variants.find((v) => v.inStock);
    if (!firstVariant) return;
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.images[0],
      variant: firstVariant,
      quantity: 1,
      unitPrice: firstVariant.price,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className={cn("group relative", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-xl bg-secondary"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest",
                product.badge === "bestseller" && "bg-navy text-cream",
                product.badge === "new" && "bg-gold text-navy",
                product.badge === "sale" && "bg-destructive text-cream",
                product.badge === "limited" && "bg-navy text-gold"
              )}
            >
              {product.badge}
            </span>
          )}
          <button
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/95 text-navy shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              className={cn("size-4", wishlisted && "fill-gold stroke-gold")}
            />
          </button>
          {showQuickAdd && (
            <button
              onClick={handleQuickAdd}
              aria-label="Quick add"
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-navy text-cream opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1.5 px-1">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3",
                i < Math.round(product.rating)
                  ? "fill-gold stroke-gold"
                  : "stroke-navy/20"
              )}
            />
          ))}
          <span className="ml-1 text-[10px] text-navy/60">
            ({product.reviewCount})
          </span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-navy transition-colors hover:text-gold sm:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-navy">
            {formatPrice(product.basePrice, currency, language)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-navy/40 line-through">
              {formatPrice(product.compareAtPrice, currency, language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}