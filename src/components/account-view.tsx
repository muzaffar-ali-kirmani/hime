"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  Sparkles,
  LogOut,
  Settings,
} from "lucide-react";
import { ShopLayout } from "@/components/shop-layout";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { getProduct } from "@/lib/data";

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "designs", label: "Saved Designs", icon: Sparkles },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: Settings },
];

export function AccountView() {
  const { wishlist, savedDesigns, removeSavedDesign } = useStore();
  const { currency, language } = useLocale();
  const [tab, setTab] = useState("orders");

  const wishlistProducts = wishlist.map(getProduct).filter(Boolean) as ReturnType<typeof getProduct>[];

  return (
    <ShopLayout>
      <section className="container-wide py-10 lg:py-14">
        <div className="flex flex-col items-start gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-gold/15">
              <User className="size-6 text-gold" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-navy/60">
                Welcome back
              </p>
              <h1 className="font-serif text-3xl text-navy sm:text-4xl">Layla A.</h1>
            </div>
          </div>
          <Button variant="outline" className="rounded-full text-xs">
            <LogOut className="me-2 size-3.5" /> Sign out
          </Button>
        </div>

        <div className="grid gap-8 pt-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-all lg:rounded-md lg:px-3 lg:py-2 lg:text-left",
                  tab === t.id
                    ? "bg-navy text-cream"
                    : "text-navy hover:bg-navy/5"
                )}
              >
                <t.icon className="size-3.5" /> {t.label}
              </button>
            ))}
          </nav>

          <div>
            {tab === "orders" && <OrdersPanel />}
            {tab === "wishlist" && (
              <div>
                {wishlistProducts.length === 0 ? (
                  <EmptyState
                    title="Your wishlist is empty"
                    desc="Tap the heart on any piece to save it for later."
                    cta="Browse shop"
                    href="/shop"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                    {wishlistProducts.map((p) => p && (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {tab === "designs" && (
              <div>
                {savedDesigns.length === 0 ? (
                  <EmptyState
                    title="No saved designs yet"
                    desc="Design your custom piece and save it here."
                    cta="Start creating"
                    href="/customize"
                  />
                ) : (
                  <ul className="space-y-3">
                    {savedDesigns.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
                      >
                        <div>
                          <p className="font-medium text-navy">{d.productName}</p>
                          <p className="mt-1 text-xs text-navy/60">
                            Saved {new Date(d.createdAt).toLocaleDateString()} ·{" "}
                            {d.config.engraving && `"${d.config.engraving}"`}
                            {d.config.gemstone && ` · ${d.config.gemstone}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <Link href="/customize">Edit</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSavedDesign(d.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {tab === "addresses" && (
              <div className="space-y-3">
                {[
                  {
                    label: "Home",
                    name: "Layla Al Marzoqi",
                    address: "Marina Heights, Apt 1204, Dubai Marina",
                    city: "Dubai, UAE",
                  },
                  {
                    label: "Office",
                    name: "Layla Al Marzoqi",
                    address: "DIFC Gate Village 7, Level 3",
                    city: "Dubai, UAE",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between rounded-2xl border border-border bg-card p-5"
                  >
                    <div>
                      <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-navy">
                        {a.label}
                      </span>
                      <p className="mt-3 font-medium text-navy">{a.name}</p>
                      <p className="text-sm text-navy/70">{a.address}</p>
                      <p className="text-sm text-navy/70">{a.city}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="rounded-full">
                  + Add new address
                </Button>
              </div>
            )}
            {tab === "profile" && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-2xl text-navy">Profile</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileField label="First name" value="Layla" />
                  <ProfileField label="Last name" value="Al Marzoqi" />
                  <ProfileField label="Email" value="layla@example.com" />
                  <ProfileField label="Phone" value="+971 50 123 4567" />
                </div>
                <Button className="rounded-full bg-navy text-cream hover:bg-navy/90">
                  Save changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}

function OrdersPanel() {
  const { currency, language } = useLocale();
  const orders = [
    {
      id: "LU-9F23A1",
      date: "12 Mar 2026",
      status: "In production",
      total: 248,
      items: 1,
    },
    {
      id: "LU-7K11B4",
      date: "28 Feb 2026",
      status: "Delivered",
      total: 159,
      items: 1,
    },
    {
      id: "LU-5Q88D2",
      date: "14 Feb 2026",
      status: "Delivered",
      total: 348,
      items: 2,
    },
  ];

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-navy/60">Order</p>
              <p className="text-sm font-medium text-navy">#{o.id}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-navy/60">Date</p>
              <p className="text-sm text-navy">{o.date}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-navy/60">Total</p>
              <p className="text-sm text-navy">
                {formatPrice(o.total, currency, language)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-navy/60">Status</p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest",
                  o.status === "Delivered"
                    ? "bg-success/15 text-success"
                    : "bg-gold/15 text-navy"
                )}
              >
                {o.status}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            Track
          </Button>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  desc,
  cta,
  href,
}: {
  title: string;
  desc: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-12 text-center">
      <p className="font-serif text-2xl text-navy">{title}</p>
      <p className="max-w-sm text-sm text-navy/60">{desc}</p>
      <Button
        asChild
        className="mt-2 rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
      >
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-navy/60">
        {label}
      </label>
      <input
        defaultValue={value}
        className="mt-1 h-10 w-full rounded-full border border-border bg-cream px-3 text-sm text-navy"
      />
    </div>
  );
}