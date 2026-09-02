"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
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
import { ShopLayout } from "@/components/shop-layout";

export function CartView() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useStore();
  const { currency, language, t } = useLocale();
  const [promo, setPromo] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD_USD) * 100);
  const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD_USD ? 0 : STANDARD_SHIPPING_USD;
  const total = cartSubtotal + shipping + (giftWrap ? 8 : 0);

  return (
    <ShopLayout>
      <section className="container-wide py-10 lg:py-14">
        <h1 className="mb-8 font-serif text-4xl text-navy sm:text-5xl">
          Your bag
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-20 text-center">
            <div className="rounded-full bg-secondary p-5">
              <ShoppingBag className="size-8 text-navy/60" />
            </div>
            <h2 className="font-serif text-3xl text-navy">Your bag is empty</h2>
            <p className="max-w-sm text-sm text-navy/60">
              Pieces made just for her are waiting. Start with our best sellers.
            </p>
            <Button
              asChild
              className="mt-2 rounded-full bg-navy px-8 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-navy/60">
                    {remaining > 0
                      ? `Add ${formatPrice(remaining, currency, language)} more for free shipping`
                      : "✨ Free shipping unlocked"}
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary"
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
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${item.productSlug}`}
                            className="font-medium text-navy hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs capitalize text-navy/60">
                            {item.variant.metal.replace("-", " ")}
                            {item.variant.lengthCm && ` · ${item.variant.lengthCm}cm`}
                            {item.variant.size && ` · Size ${item.variant.size}`}
                          </p>
                          {item.personalization?.engravingText && (
                            <p className="mt-1 text-xs italic text-gold">
                              "{item.personalization.engravingText}"
                            </p>
                          )}
                          {item.personalization?.gemstone && (
                            <p className="mt-1 text-xs text-navy/60">
                              {item.personalization.gemstone} birthstone
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove"
                          className="rounded-full p-1 text-navy/40 hover:bg-secondary hover:text-navy"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease"
                          >
                            <Minus className="size-3 text-navy" />
                          </button>
                          <span className="min-w-[1.25rem] text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
            </div>

            <aside>
              <div className="sticky top-24 space-y-4 rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-2xl text-navy">Order summary</h3>

                <div className="space-y-2">
                  <Input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="rounded-full"
                  />
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm text-navy">Add gift wrap · $8</span>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="accent-navy"
                  />
                </label>

                {giftWrap && (
                  <textarea
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Add a gift note…"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card p-3 text-sm"
                  />
                )}

                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy/70">Subtotal</dt>
                    <dd className="text-navy">{formatPrice(cartSubtotal, currency, language)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy/70">Shipping</dt>
                    <dd className="text-navy">
                      {shipping === 0 ? "Free" : formatPrice(shipping, currency, language)}
                    </dd>
                  </div>
                  {giftWrap && (
                    <div className="flex justify-between">
                      <dt className="text-navy/70">Gift wrap</dt>
                      <dd className="text-navy">{formatPrice(8, currency, language)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 font-serif text-lg">
                    <dt className="text-navy">Total</dt>
                    <dd className="text-navy">{formatPrice(total, currency, language)}</dd>
                  </div>
                </dl>

                <Button
                  asChild
                  className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
                >
                  <Link href="/checkout">
                    {t("checkout")} <ArrowRight className="ms-2 size-3.5" />
                  </Link>
                </Button>
                <p className="text-center text-xs text-navy/55">
                  ✦ Secure checkout · 30-day returns
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </ShopLayout>
  );
}