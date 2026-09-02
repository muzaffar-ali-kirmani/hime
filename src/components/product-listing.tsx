"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS, OCCASIONS } from "@/lib/data";
import type { Product, MetalFinish } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterState {
  metal: MetalFinish | "all";
  category: string | "all";
  occasion: string | "all";
  personalizeOnly: boolean;
  priceRange: [number, number];
  sortBy: "featured" | "price-asc" | "price-desc" | "newest";
}

const defaultFilters: FilterState = {
  metal: "all",
  category: "all",
  occasion: "all",
  personalizeOnly: false,
  priceRange: [0, 500],
  sortBy: "featured",
};

export function ProductListing({
  initialCategory,
  title,
  subtitle,
}: {
  initialCategory?: string;
  title: string;
  subtitle?: string;
}) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: initialCategory || "all",
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (filters.metal !== "all") {
      result = result.filter((p) =>
        p.variants.some((v) => v.metal === filters.metal)
      );
    }
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.occasion !== "all") {
      result = result.filter((p) => p.occasion?.includes(filters.occasion));
    }
    if (filters.personalizeOnly) {
      result = result.filter(
        (p) => p.personalization?.engraving || p.personalization?.gemstone || p.personalization?.charm
      );
    }
    result = result.filter(
      (p) =>
        p.basePrice >= filters.priceRange[0] && p.basePrice <= filters.priceRange[1]
    );
    if (filters.sortBy === "price-asc") result.sort((a, b) => a.basePrice - b.basePrice);
    if (filters.sortBy === "price-desc") result.sort((a, b) => b.basePrice - a.basePrice);
    if (filters.sortBy === "newest") {
      result.sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
    }
    return result;
  }, [filters]);

  const activeFilterCount =
    (filters.metal !== "all" ? 1 : 0) +
    (filters.category !== "all" && !initialCategory ? 1 : 0) +
    (filters.occasion !== "all" ? 1 : 0) +
    (filters.personalizeOnly ? 1 : 0);

  return (
    <section className="container-wide py-10 lg:py-14">
      <header className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          {subtitle || "Collection"}
        </p>
        <h1 className="mt-1 font-serif text-4xl text-navy sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-navy/60">{filtered.length} pieces</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className="hidden lg:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
          />
        </aside>

        {/* Mobile filter trigger */}
        <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between gap-3 border-b border-border/40 bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(true)}
            className="rounded-full"
          >
            <SlidersHorizontal className="me-2 size-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ms-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] text-navy">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sortBy: e.target.value as FilterState["sortBy"],
              }))
            }
            className="h-9 rounded-full border border-border bg-card px-3 text-xs text-navy"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        {/* Mobile filter sheet */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-navy/40"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-cream p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-2xl text-navy">Filters</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          </div>
        )}

        <div>
          {/* Desktop sort */}
          <div className="mb-5 hidden items-center justify-between lg:flex">
            <p className="text-sm text-navy/60">{filtered.length} pieces</p>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sortBy: e.target.value as FilterState["sortBy"],
                }))
              }
              className="h-9 rounded-full border border-border bg-card px-3 text-xs text-navy"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="font-serif text-2xl text-navy">No matches yet</p>
              <p className="text-sm text-navy/60">
                Try adjusting your filters to find your piece.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
                className="rounded-full"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  filters,
  onChange,
  onClose,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose?: () => void;
}) {
  const metals: { id: MetalFinish | "all"; label: string; swatch: string }[] = [
    { id: "all", label: "All", swatch: "" },
    { id: "gold", label: "Gold", swatch: "linear-gradient(135deg, #E8D9B8, #C9A66B)" },
    { id: "rose-gold", label: "Rose Gold", swatch: "linear-gradient(135deg, #F4D4C4, #B8866F)" },
    { id: "silver", label: "Silver", swatch: "linear-gradient(135deg, #F0F0F0, #A8A8A8)" },
  ];

  return (
    <div className="space-y-6 text-sm">
      <FilterGroup title="Metal">
        <div className="flex flex-wrap gap-2">
          {metals.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange({ ...filters, metal: m.id as FilterState["metal"] })}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all",
                filters.metal === m.id
                  ? "border-navy bg-navy text-cream"
                  : "border-border bg-card text-navy hover:border-navy/50"
              )}
            >
              {m.swatch && (
                <span
                  className="size-3 rounded-full"
                  style={{ background: m.swatch }}
                />
              )}
              {m.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Occasion">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ ...filters, occasion: "all" })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-all",
              filters.occasion === "all"
                ? "border-navy bg-navy text-cream"
                : "border-border bg-card text-navy hover:border-navy/50"
            )}
          >
            All
          </button>
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => onChange({ ...filters, occasion: o })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-all",
                filters.occasion === o
                  ? "border-navy bg-navy text-cream"
                  : "border-border bg-card text-navy hover:border-navy/50"
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Personalisation">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3">
          <input
            type="checkbox"
            checked={filters.personalizeOnly}
            onChange={(e) =>
              onChange({ ...filters, personalizeOnly: e.target.checked })
            }
            className="accent-navy"
          />
          <span className="text-xs text-navy">Personalise-able only</span>
        </label>
      </FilterGroup>

      <FilterGroup title="Price (USD)">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              className="h-9 rounded-md"
              placeholder="Min"
            />
            <span className="text-navy/40">—</span>
            <Input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="h-9 rounded-md"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterGroup>

      <Button
        variant="outline"
        onClick={() => onChange(defaultFilters)}
        className="w-full rounded-full text-xs uppercase tracking-widest"
      >
        Reset filters
      </Button>
      {onClose && (
        <Button
          onClick={onClose}
          className="w-full rounded-full bg-navy text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
        >
          Show results
        </Button>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/40 pb-5 last:border-b-0">
      <h4 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-navy">
        {title}
      </h4>
      {children}
    </div>
  );
}