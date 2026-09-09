"use client";

import { useEffect, useState } from "react";
import { ProductCarousel } from "./product-carousel";
import type { Product } from "@/lib/types";

/**
 * Database-backed product carousel for the homepage.
 * Fetches live products from /api/products and filters by badge;
 * falls back to the newest products when no product carries the badge.
 */
export function DbProductCarousel({
  title,
  subtitle,
  badge,
  limit = 8,
  showQuickAdd,
}: {
  title: string;
  subtitle?: string;
  badge: "new" | "bestseller" | "sale" | "limited";
  limit?: number;
  showQuickAdd?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        const json = await res.json();
        if (!cancelled) setProducts(json.products || []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const withBadge = products.filter((p) => p.badge === badge).slice(0, limit);
  const section =
    withBadge.length > 0 ? withBadge : products.slice(0, limit); // fallback: newest from the DB

  return (
    <ProductCarousel
      title={title}
      subtitle={subtitle}
      products={section}
      showQuickAdd={showQuickAdd}
    />
  );
}
