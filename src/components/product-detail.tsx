"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Truck,
  Shield,
  Ruler,
  Star,
  Plus,
  Minus,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice, COUNTRIES } from "@/lib/locale";
import type { Product, MetalFinish } from "@/lib/types";
import { getProduct } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  product: Product;
}

interface DbReview {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

export function ProductDetail({ product }: Props) {
  const { currency, language, country, t } = useLocale();
  const { addToCart, toggleWishlist, isWishlisted, pushRecentlyViewed, cartSubtotal, settings } = useStore();
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setReviewsLoading(true);
    fetch(`/api/reviews?productId=${encodeURIComponent(product.id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setReviews(data.reviews || []);
        setReviewsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
          setReviewsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const firstAvailable = product.variants.find((v) => v.inStock) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(firstAvailable);
  const [engraving, setEngraving] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    pushRecentlyViewed(product.id);
  }, [product.id, pushRecentlyViewed]);

  const wishlisted = isWishlisted(product.id);

  const price = selectedVariant.price;

  const countryName = COUNTRIES[country].name;
  const deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (selectedVariant.madeToOrder ? 9 : 4));
    return d.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  })();

  const changeQuantity = (next: number) => {
    setQuantity(Math.max(1, next));
  };

  const handleAddToCart = () => {
    // Engraving is required when the product supports it
    if (product.personalization?.engraving && !engraving.trim()) {
      toast.error("Please enter an engraving to continue");
      return;
    }
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.images[0],
      variant: selectedVariant,
      personalization: {
        engravingText: engraving || undefined,
      },
      quantity,
      unitPrice: price,
    });
  };

  const uniqueMetals = Array.from(new Set(product.variants.map((v) => v.metal)));
  const lengthOptions = Array.from(
    new Set(product.variants.filter((v) => v.lengthCm).map((v) => v.lengthCm))
  );
  const sizeOptions = Array.from(
    new Set(product.variants.filter((v) => v.size).map((v) => v.size))
  );

  // "Complete the set" cross-sell — live DB products, randomized on every load
  const [relatedSet, setRelatedSet] = useState<Product[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        const json = await res.json();
        if (cancelled) return;
        const all: Product[] = (json.products || []).filter(
          (p: Product) => p.id !== product.id
        );
        // Fisher–Yates shuffle so recommendations differ on each visit
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        setRelatedSet(all.slice(0, 3));
      } catch {
        if (!cancelled) setRelatedSet([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  return (
    <section className="container-wide py-8 sm:py-12 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link href="/" className="hover:text-navy">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-navy">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`} className="capitalize hover:text-navy">
          {product.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              unoptimized
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-navy px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream">
                {product.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                className="aspect-square overflow-hidden rounded-lg bg-secondary ring-1 ring-border transition hover:ring-navy"
              >
                <Image
                  src={product.images[0]}
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="h-full w-full object-cover opacity-70 hover:opacity-100"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex items-center gap-3 text-xs">
            <span className="badge-gold">{product.category.replace("-", " ")}</span>
            {product.isHalalFriendly && <span className="badge-gold">Halal-friendly</span>}
            {product.isHypoallergenic && (
              <span className="badge-gold">Hypoallergenic</span>
            )}
          </div>
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.round(product.rating)
                      ? "fill-gold stroke-gold"
                      : "stroke-navy/20"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-navy/60">
              {product.rating} ({product.reviewCount} {t("reviews")})
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/75">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-navy">
              {formatPrice(price, currency, language)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-navy/40 line-through">
                {formatPrice(product.compareAtPrice, currency, language)}
              </span>
            )}
          </div>

          {/* Metal */}
          <div className="mt-7">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-navy">
              {t("finish")}: <span className="capitalize">{selectedVariant.metal.replace("-", " ")}</span>
            </p>
            <div className="flex gap-2">
              {uniqueMetals.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    const v = product.variants.find(
                      (vt) => vt.metal === m && vt.inStock
                    );
                    if (v) setSelectedVariant(v);
                  }}
                  className={cn(
                    "group flex flex-col items-center gap-2",
                    selectedVariant.metal === m && ""
                  )}
                >
                  <span
                    className={cn(
                      "size-10 rounded-full border-2 transition-all",
                      selectedVariant.metal === m
                        ? "border-navy ring-2 ring-gold ring-offset-2 ring-offset-cream"
                        : "border-border"
                    )}
                    style={{
                      background:
                        m === "gold"
                          ? "linear-gradient(135deg, #E8D9B8, #A88A4D)"
                          : m === "rose-gold"
                          ? "linear-gradient(135deg, #F4D4C4, #B8866F)"
                          : "linear-gradient(135deg, #F0F0F0, #A8A8A8)",
                    }}
                  />
                  <span className="text-[10px] capitalize text-navy/70">
                    {m.replace("-", " ")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Length / Size */}
          {(lengthOptions.length > 0 || sizeOptions.length > 0) && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-widest text-navy">
                  {sizeOptions.length > 0 ? "Ring size" : `${t("length")} (cm)`}
                </p>
                {sizeOptions.length > 0 && (
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-xs text-gold hover:underline"
                  >
                    <Ruler className="size-3" /> {t("size.guide")}
                  </button>
                )}
              </div>
              {lengthOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {lengthOptions.map((l) => {
                    const variant = product.variants.find(
                      (v) => v.metal === selectedVariant.metal && v.lengthCm === l
                    );
                    if (!variant) return null;
                    return (
                      <button
                        key={l}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "min-w-[64px] rounded-full border px-4 py-2 text-sm transition-all",
                          selectedVariant.lengthCm === l
                            ? "border-navy bg-navy text-cream"
                            : "border-border bg-card text-navy hover:border-navy"
                        )}
                      >
                        {l} cm
                      </button>
                    );
                  })}
                </div>
              )}
              {sizeOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => {
                    const variant = product.variants.find(
                      (v) => v.metal === selectedVariant.metal && v.size === s
                    );
                    if (!variant) return null;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.inStock}
                        className={cn(
                          "min-w-[64px] rounded-full border px-4 py-2 text-sm transition-all",
                          selectedVariant.size === s
                            ? "border-navy bg-navy text-cream"
                            : "border-border bg-card text-navy hover:border-navy",
                          !variant.inStock && "opacity-40 line-through"
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Engraving */}
          {product.personalization?.engraving && (() => {
            const maxLen = product.personalization!.engraving!.maxLength;
            // Buying 2+ pieces means one engraving per piece, so ask for two names.
            return (
              <div className="mt-7 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="size-3.5 text-gold" />
                  <p className="text-[11px] font-medium uppercase tracking-widest text-navy">
                    {t("engraving")}
                  </p>
                  <span className="text-[10px] text-navy/50">
                    · up to {maxLen} characters
                  </span>
                </div>
                <Input
                  value={engraving}
                  onChange={(e) =>
                    setEngraving(
                      e.target.value.slice(0, product.personalization!.engraving!.maxLength)
                    )
                  }
                  placeholder={product.personalization.engraving.placeholder}
                  maxLength={product.personalization.engraving.maxLength}
                  className="rounded-full bg-card"
                />
              </div>
            );
          })()}

          {/* Add to cart */}
          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button
                onClick={() => changeQuantity(quantity - 1)}
                className="px-3 py-2 text-navy disabled:opacity-30"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => changeQuantity(quantity + 1)}
                className="px-3 py-2 text-navy"
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant.inStock}
              className="flex-1 rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              {selectedVariant.inStock ? t("add.to.cart") : "Notify me when back"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleWishlist(product.id)}
              className="rounded-full"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={cn("size-4", wishlisted && "fill-gold stroke-gold")}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Share"
            >
              <Share2 className="size-4" />
            </Button>
          </div>

          {/* Trust / delivery */}
          <div className="mt-6 grid gap-2 rounded-2xl border border-border bg-secondary/40 p-5">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="size-4 text-gold" />
              <span className="text-navy">
                Ships to <strong>{countryName}</strong> by{" "}
                <strong>{deliveryDate}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="size-4 text-gold" />
              <span className="text-navy">
                {selectedVariant.madeToOrder
                  ? "Made to order · Ships in 5–7 days"
                  : "In stock · Ships in 10-12 working days"}
              </span>
            </div>
            {settings.shippingEnabled &&
              cartSubtotal < settings.freeShippingThreshold && (
                <p className="mt-2 text-xs text-navy/60">
                  ✨ Add{" "}
                  {formatPrice(settings.freeShippingThreshold - cartSubtotal, currency, language)}{" "}
                  for free shipping
                </p>
              )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-10">
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-navy data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-navy data-[state=active]:bg-transparent"
              >
                Materials & Care
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-navy data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-5">
              <p className="text-sm leading-relaxed text-navy/80">{product.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-navy/80">
                {product.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <Check className="size-3.5 text-gold" /> {m}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="materials" className="pt-5">
              <h4 className="font-serif text-lg text-navy">Materials</h4>
              <p className="mt-2 text-sm text-navy/75">{product.materials.join(", ")}.</p>
              <h4 className="mt-5 font-serif text-lg text-navy">Care</h4>
              <p className="mt-2 text-sm text-navy/75">{product.careInstructions}</p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-5">
              <div className="flex items-center gap-4">
                <p className="font-serif text-5xl text-navy">{product.rating}</p>
                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < Math.round(product.rating)
                            ? "fill-gold stroke-gold"
                            : "stroke-navy/20"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-navy/60">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>
              </div>
              <Separator className="my-5" />
              <div className="space-y-4">
                {reviewsLoading ? (
                  <p className="py-6 text-center text-sm text-navy/60">Loading reviews…</p>
                ) : reviews.length === 0 ? (
                  <p className="py-6 text-center text-sm text-navy/60">
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-navy">{r.authorName}</p>
                        {r.isVerified && (
                          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] uppercase tracking-widest text-success">
                            Verified
                          </span>
                        )}
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="size-3 fill-gold stroke-gold" />
                          ))}
                        </div>
                      </div>
                      {r.title && (
                        <p className="mt-1 text-sm font-medium text-navy">{r.title}</p>
                      )}
                      <p className="mt-1 text-sm text-navy/75">{r.body}</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Complete the set */}
      <div className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Complete the set
            </p>
            <h2 className="mt-1 font-serif text-3xl text-navy">Pieces that pair</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          {relatedSet.map((p) => (
            <ProductCard key={p.id} product={p} showQuickAdd={false} />
          ))}
        </div>
      </div>

      {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </section>
  );
}

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-cream p-6 sm:p-8">
        <h3 className="font-serif text-2xl text-navy">Ring Size Guide</h3>
        <p className="mt-2 text-sm text-navy/70">
          Measure the inside diameter of a ring that fits the same finger.
          Match to the size below.
        </p>
        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-navy/60">
              <th className="py-2">GCC / US</th>
              <th className="py-2">EU</th>
              <th className="py-2">Diameter (mm)</th>
            </tr>
          </thead>
          <tbody className="text-navy">
            {[
              ["5", "49", "15.7"],
              ["6", "52", "16.5"],
              ["7", "54", "17.3"],
              ["8", "57", "18.1"],
              ["9", "59", "19.0"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-border/40 last:border-b-0">
                {row.map((cell, i) => (
                  <td key={i} className="py-2.5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-navy text-cream hover:bg-navy/90"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}