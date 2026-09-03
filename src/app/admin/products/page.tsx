"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Star,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "necklaces",
  "bracelets",
  "rings",
  "earrings",
  "anklets",
  "initial-charm",
];

const METALS = ["gold", "rose-gold", "silver"];
const BADGES = ["new", "bestseller", "sale", "limited"];

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  compareAtPrice: number | null;
  badge: string | null;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isHalalFriendly: boolean;
  isHypoallergenic: boolean;
  images: string[];
  tags: string[];
  occasion: string[];
  materials: string[];
  careInstructions: string;
  personalization: any;
}

export default function AdminProductsPage() {
  const { currency, language } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ id?: string; isNew?: boolean } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products", { credentials: "include" });
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    toast.success(p.isActive ? "Product hidden" : "Product published");
    load();
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${p.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    toast.success("Product deleted");
    load();
  }

  const filtered = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy sm:text-4xl">Products</h1>
          <p className="mt-1 text-sm text-navy/60">
            {products.length} total · {products.filter((p) => p.isActive).length}{" "}
            active
          </p>
        </div>
        <Button
          onClick={() => setEditing({ isNew: true })}
          className="rounded-full bg-navy text-cream hover:bg-navy/90"
        >
          <Plus className="me-2 size-4" /> New product
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug…"
            className="h-10 rounded-full pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-card px-3 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-navy/60">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] bg-secondary">
                {p.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                )}
                {p.badge && (
                  <span className="absolute left-2 top-2 rounded-full bg-navy px-2 py-0.5 text-[9px] uppercase tracking-widest text-cream">
                    {p.badge}
                  </span>
                )}
                {!p.isActive && (
                  <span className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[9px] uppercase tracking-widest text-cream">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-navy/55">
                  {p.category}
                </p>
                <h3 className="mt-1 font-serif text-lg text-navy">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-navy">
                    {formatPrice(p.basePrice, currency, language)}
                  </span>
                  <span className="flex items-center gap-1 text-navy/60">
                    <Star className="size-3 fill-gold stroke-gold" />
                    {p.rating} ({p.reviewCount})
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing({ id: p.id })}
                    className="flex-1 rounded-full text-xs"
                  >
                    <Pencil className="me-1.5 size-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(p)}
                    className="rounded-full text-xs"
                  >
                    {p.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProduct(p)}
                    className="rounded-full text-xs text-destructive hover:border-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-navy/60">
              No products found.
            </p>
          )}
        </div>
      )}

      {editing && (
        <ProductEditDrawer
          productId={editing.id}
          isNew={editing.isNew}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProductEditDrawer({
  productId,
  isNew,
  onClose,
  onSaved,
}: {
  productId?: string;
  isNew?: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({
    name: "",
    slug: "",
    description: "",
    category: "necklaces",
    basePrice: 0,
    compareAtPrice: null,
    badge: null,
    images: [""],
    materials: [""],
    careInstructions: "",
    isHalalFriendly: false,
    isHypoallergenic: false,
    isActive: true,
    tags: [],
    occasion: [],
    variants: [
      { metal: "gold", price: 0, inStock: true, stockCount: 0 },
    ],
  });

  useEffect(() => {
    if (isNew || !productId) return;
    (async () => {
      const res = await fetch(`/api/admin/products/${productId}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.product) {
        setData({
          ...json.product,
          tags: json.product.tags || [],
          occasion: json.product.occasion || [],
          materials: json.product.materials || [""],
          images: json.product.images || [""],
          variants: json.variants || [],
        });
      }
      setLoading(false);
    })();
  }, [productId, isNew]);

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...data,
        tags: typeof data.tags === "string" ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : data.tags,
        occasion: typeof data.occasion === "string" ? data.occasion.split(",").map((t: string) => t.trim()).filter(Boolean) : data.occasion,
        materials: data.materials.filter((m: string) => m.trim()),
        images: data.images.filter((i: string) => i.trim()),
        compareAtPrice: data.compareAtPrice || null,
        badge: data.badge || null,
      };
      const url = isNew
        ? "/api/admin/products"
        : `/api/admin/products/${productId}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Save failed");
      }
      toast.success(isNew ? "Product created" : "Product updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-cream">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-cream px-6 py-4">
          <h2 className="font-serif text-2xl text-navy">
            {isNew ? "New product" : "Edit product"}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={save}
              disabled={saving || loading}
              className="rounded-full bg-navy text-cream hover:bg-navy/90"
            >
              <Save className="me-2 size-4" /> {saving ? "Saving…" : "Save"}
            </Button>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-navy/5">
              <X className="size-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-navy/60">Loading…</p>
        ) : (
          <div className="space-y-5 p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Field>
              <Field label="Slug (URL)">
                <Input
                  value={data.slug}
                  onChange={(e) =>
                    setData({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={4}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Category">
                <select
                  value={data.category}
                  onChange={(e) => setData({ ...data, category: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Base price (USD)">
                <Input
                  type="number"
                  step="0.01"
                  value={data.basePrice}
                  onChange={(e) =>
                    setData({ ...data, basePrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Compare at (USD)">
                <Input
                  type="number"
                  step="0.01"
                  value={data.compareAtPrice || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      compareAtPrice: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Badge">
                <select
                  value={data.badge || ""}
                  onChange={(e) =>
                    setData({ ...data, badge: e.target.value || null })
                  }
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  <option value="">None</option>
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tags (comma-separated)">
                <Input
                  value={Array.isArray(data.tags) ? data.tags.join(", ") : data.tags}
                  onChange={(e) => setData({ ...data, tags: e.target.value })}
                  placeholder="initial, 18K, engravable"
                />
              </Field>
            </div>

            <Field label="Image URLs (one per line)">
              <Textarea
                value={data.images.join("\n")}
                onChange={(e) =>
                  setData({ ...data, images: e.target.value.split("\n") })
                }
                rows={3}
                placeholder="https://… or data:image/svg+xml,…"
              />
            </Field>

            <Field label="Materials (one per line)">
              <Textarea
                value={data.materials.join("\n")}
                onChange={(e) =>
                  setData({ ...data, materials: e.target.value.split("\n") })
                }
                rows={3}
              />
            </Field>

            <Field label="Care instructions">
              <Textarea
                value={data.careInstructions}
                onChange={(e) =>
                  setData({ ...data, careInstructions: e.target.value })
                }
                rows={2}
              />
            </Field>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={data.isActive}
                  onChange={(e) =>
                    setData({ ...data, isActive: e.target.checked })
                  }
                  className="accent-navy"
                />
                Active (visible in store)
              </label>
              <label className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={data.isHalalFriendly}
                  onChange={(e) =>
                    setData({ ...data, isHalalFriendly: e.target.checked })
                  }
                  className="accent-navy"
                />
                Halal-friendly
              </label>
              <label className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={data.isHypoallergenic}
                  onChange={(e) =>
                    setData({ ...data, isHypoallergenic: e.target.checked })
                  }
                  className="accent-navy"
                />
                Hypoallergenic
              </label>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-medium text-navy">Variants</h3>
              <p className="mb-3 text-xs text-navy/55">
                Configure metal, size, and stock for each variant.
              </p>
              <div className="space-y-3">
                {data.variants.map((v: any, i: number) => (
                  <div
                    key={i}
                    className="grid items-end gap-2 rounded-lg bg-cream/40 p-3 sm:grid-cols-6"
                  >
                    <Field label="Metal">
                      <select
                        value={v.metal}
                        onChange={(e) => {
                          const vs = [...data.variants];
                          vs[i] = { ...v, metal: e.target.value };
                          setData({ ...data, variants: vs });
                        }}
                        className="h-9 rounded-md border border-border bg-card px-2 text-sm"
                      >
                        {METALS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Length (cm)">
                      <Input
                        type="number"
                        value={v.lengthCm || ""}
                        onChange={(e) => {
                          const vs = [...data.variants];
                          vs[i] = {
                            ...v,
                            lengthCm: e.target.value ? parseFloat(e.target.value) : null,
                          };
                          setData({ ...data, variants: vs });
                        }}
                        className="h-9"
                      />
                    </Field>
                    <Field label="Size">
                      <Input
                        value={v.size || ""}
                        onChange={(e) => {
                          const vs = [...data.variants];
                          vs[i] = { ...v, size: e.target.value || null };
                          setData({ ...data, variants: vs });
                        }}
                        className="h-9"
                      />
                    </Field>
                    <Field label="Price">
                      <Input
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const vs = [...data.variants];
                          vs[i] = { ...v, price: parseFloat(e.target.value) || 0 };
                          setData({ ...data, variants: vs });
                        }}
                        className="h-9"
                      />
                    </Field>
                    <Field label="Stock">
                      <Input
                        type="number"
                        value={v.stockCount}
                        onChange={(e) => {
                          const vs = [...data.variants];
                          vs[i] = {
                            ...v,
                            stockCount: parseInt(e.target.value) || 0,
                          };
                          setData({ ...data, variants: vs });
                        }}
                        className="h-9"
                      />
                    </Field>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const vs = data.variants.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, variants: vs });
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData({
                      ...data,
                      variants: [
                        ...data.variants,
                        { metal: "gold", price: data.basePrice, inStock: true, stockCount: 0 },
                      ],
                    })
                  }
                  className="rounded-full"
                >
                  <Plus className="me-2 size-3.5" /> Add variant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-widest text-navy/60">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}