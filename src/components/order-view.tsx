"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Package, Truck, Hammer, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice, COUNTRIES } from "@/lib/locale";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function OrderView({ orderNumber }: { orderNumber: string }) {
  const { currency, language } = useLocale();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { order, items } = await api.getOrder(orderNumber);
        setOrder(order);
        setItems(items);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderNumber]);

  if (loading) {
    return (
      <section className="container-wide py-20 text-center">
        <p className="text-sm text-navy/60">Loading order…</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="container-wide py-20 text-center">
        <h1 className="font-serif text-3xl text-navy">Order not found</h1>
        <Button
          asChild
          className="mt-4 rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
        >
          <Link href="/">Back home</Link>
        </Button>
      </section>
    );
  }

  const statusSteps = [
    { id: "pending", label: "Confirmed", icon: Check },
    { id: "in_production", label: "In production", icon: Hammer },
    { id: "shipped", label: "Shipped", icon: Package },
    { id: "delivered", label: "Delivered", icon: Truck },
  ];
  const currentStep = statusSteps.findIndex((s) => s.id === order.status);

  return (
    <section className="container-wide py-10 lg:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-navy/60">
            Order confirmation
          </p>
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">
            #{order.orderNumber}
          </h1>
        </div>
        <p className="text-sm text-navy/60">
          Placed {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Status tracker */}
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-navy">Order status</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {statusSteps.map((s, i) => {
                const passed = i <= currentStep;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "flex flex-1 min-w-[120px] items-center gap-3 rounded-2xl border p-3",
                      passed
                        ? "border-gold bg-gold/10"
                        : "border-border bg-cream/40"
                    )}
                  >
                    <s.icon
                      className={cn(
                        "size-5",
                        passed ? "text-gold" : "text-navy/30"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        passed ? "text-navy" : "text-navy/40"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-navy">Items</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-xl bg-cream/40 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">{item.productName}</p>
                    <p className="text-xs capitalize text-navy/60">
                      {item.metal.replace("-", " ")}
                      {item.lengthCm && ` · ${item.lengthCm}cm`}
                      {item.size && ` · Size ${item.size}`}
                    </p>
                    {item.engravingText && (
                      <p className="mt-1 text-xs italic text-gold">
                        "{item.engravingText}"
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-navy">
                    {formatPrice(item.unitPriceUsd * item.quantity, currency, language)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside>
          <div className="space-y-3 rounded-3xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl text-navy">Summary</h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-navy/70">
                <dt>Subtotal</dt>
                <dd>{formatPrice(order.subtotalUsd, currency, language)}</dd>
              </div>
              <div className="flex justify-between text-navy/70">
                <dt>Shipping</dt>
                <dd>
                  {order.shippingUsd === 0
                    ? "Free"
                    : formatPrice(order.shippingUsd, currency, language)}
                </dd>
              </div>
              <div className="flex justify-between text-navy/70">
                <dt>VAT</dt>
                <dd>{formatPrice(order.taxUsd, currency, language)}</dd>
              </div>
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Promo ({order.promoCode})</dt>
                  <dd>-{formatPrice(order.promoDiscount, currency, language)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-serif text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalUsd, currency, language)}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-border pt-5">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-4 text-gold" />
                <p className="text-[11px] font-medium uppercase tracking-widest text-navy">
                  Shipping to
                </p>
              </div>
              <p className="text-sm text-navy">{order.shippingName}</p>
              <p className="text-sm text-navy/70">
                {order.shippingAddress1}
                {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}
                <br />
                {order.shippingArea ? `${order.shippingArea}, ` : ""}
                {order.shippingCity}, {COUNTRIES[order.shippingCountry as keyof typeof COUNTRIES]?.name || order.shippingCountry}
                <br />
                {order.shippingPhone}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}