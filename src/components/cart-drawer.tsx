"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2, Gift, Tag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD_USD,
  STANDARD_SHIPPING_USD,
} from "@/lib/locale";
import { useState } from "react";
import { PRODUCTS } from "@/lib/data";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useStore();
  const { currency, t, language } = useLocale();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  const freeShipThreshold = FREE_SHIPPING_THRESHOLD_USD;
  const remaining = Math.max(0, freeShipThreshold - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / freeShipThreshold) * 100);
  const shipping = cartSubtotal >= freeShipThreshold ? 0 : STANDARD_SHIPPING_USD;
  const total = cartSubtotal + shipping + (giftWrap ? 8 : 0) - (promoApplied ? cartSubtotal * 0.15 : 0);

  const upsellProduct = PRODUCTS.find((p) => p.id === "p-009");

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-cream p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/50 px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl text-navy">
              {t("cart")} ({cart.length})
            </SheetTitle>
          </div>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-secondary p-6">
              <ShoppingBag className="size-8 text-navy/60" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-xl text-navy">Your bag is empty</p>
              <p className="text-sm text-navy/60">
                Discover pieces made just for you
              </p>
            </div>
            <Button
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-navy text-cream hover:bg-navy/90"
              asChild
            >
              <Link href="/shop">{t("shop.now")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping bar */}
            <div className="border-b border-border/50 bg-secondary/40 px-6 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-navy/80">
                  {t("free.shipping.threshold").replace(
                    "{amount}",
                    formatPrice(remaining, currency, language)
                  )}
                </p>
              ) : (
                <p className="text-xs font-medium text-navy">
                  ✨ {t("free.shipping.unlocked")}
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-5">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={() => setCartOpen(false)}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.productSlug}`}
                            onClick={() => setCartOpen(false)}
                            className="text-sm font-medium text-navy hover:underline"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove"
                            className="text-navy/40 hover:text-navy"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs capitalize text-navy/60">
                          {item.variant.metal.replace("-", " ")}
                          {item.variant.lengthCm && ` · ${item.variant.lengthCm}cm`}
                          {item.variant.size && ` · Size ${item.variant.size}`}
                        </p>
                        {item.personalization?.engravingText && (
                          <p className="mt-1 text-xs italic text-gold">
                            "{item.personalization.engravingText}"
                          </p>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3 text-navy" />
                          </button>
                          <span className="text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase"
                          >
                            <Plus className="size-3 text-navy" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-navy">
                          {formatPrice(item.unitPrice * item.quantity, currency, language)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Upsell */}
              {upsellProduct && (
                <div className="mt-6 rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-gold">
                    Complete the set
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-md bg-secondary">
                      <Image
                        src={upsellProduct.images[0]}
                        alt={upsellProduct.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">
                        {upsellProduct.name}
                      </p>
                      <p className="text-xs text-navy/60">
                        {formatPrice(upsellProduct.basePrice, currency, language)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 bg-cream px-5 pb-6 pt-4">
              {/* Promo */}
              <div className="mb-3 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-navy/40" />
                  <Input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder={t("promo.code")}
                    className="rounded-full border-border bg-card pl-8 text-xs"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (promo.toUpperCase() === "WELCOME15") setPromoApplied(true);
                  }}
                  className="rounded-full text-xs"
                >
                  {t("apply")}
                </Button>
              </div>

              {/* Gift wrap toggle */}
              <label className="mb-3 flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Gift className="size-4 text-gold" />
                  <span className="text-xs text-navy">{t("gift.wrap")} · $8</span>
                </div>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="accent-navy"
                />
              </label>

              {/* Totals */}
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between text-navy/80">
                  <dt>{t("subtotal")}</dt>
                  <dd>{formatPrice(cartSubtotal, currency, language)}</dd>
                </div>
                <div className="flex justify-between text-navy/80">
                  <dt>Shipping</dt>
                  <dd>
                    {shipping === 0 ? "Free" : formatPrice(shipping, currency, language)}
                  </dd>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <dt>WELCOME15 (15% off)</dt>
                    <dd>-{formatPrice(cartSubtotal * 0.15, currency, language)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-semibold text-navy">
                  <dt>Total</dt>
                  <dd>{formatPrice(total, currency, language)}</dd>
                </div>
              </dl>

              <Button
                asChild
                className="mt-4 w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
              >
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  {t("checkout")} · {formatPrice(total, currency, language)}
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}