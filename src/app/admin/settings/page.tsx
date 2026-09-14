"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Mail,
  Phone,
  Globe,
  Instagram,
  Percent,
  Receipt,
  Truck,
  Plus,
  Trash2,
} from "lucide-react";
import { MAX_ANNOUNCEMENTS } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEFAULT_SETTINGS, type StoreSettings } from "@/lib/settings";

export default function AdminSettingsPage() {
  const [store, setStore] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { credentials: "include" });
        const data = await res.json();
        if (data.settings) {
          setStore({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      } catch {
        toast.error("Could not load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStore({ ...DEFAULT_SETTINGS, ...data.settings });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-navy/60">Loading settings…</p>;
  }

  const set = (patch: Partial<StoreSettings>) => setStore((s) => ({ ...s, ...patch }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-navy/60">
          Store contact info, VAT, shipping rules, and announcements.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-navy">
          <Globe className="size-4 text-gold" /> Store info
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Store name">
            <Input
              value={store.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              value={store.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={store.phone}
              onChange={(e) => set({ phone: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp">
            <Input
              value={store.whatsapp}
              onChange={(e) => set({ whatsapp: e.target.value })}
            />
          </Field>
          <Field label="Instagram">
            <Input
              value={store.instagram}
              onChange={(e) => set({ instagram: e.target.value })}
              placeholder="https://instagram.com/…"
            />
          </Field>
          <Field label="Facebook">
            <Input
              value={store.facebook}
              onChange={(e) => set({ facebook: e.target.value })}
              placeholder="https://facebook.com/…"
            />
          </Field>
          <Field label="TikTok">
            <Input
              value={store.tiktok}
              onChange={(e) => set({ tiktok: e.target.value })}
              placeholder="https://tiktok.com/@…"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-navy">
          <Receipt className="size-4 text-gold" /> VAT
        </h2>
        <div className="flex items-center justify-between rounded-xl border border-border bg-cream/40 p-4">
          <div className="flex items-center gap-3">
            <Percent className="size-4 text-gold" />
            <div>
              <p className="text-sm font-medium text-navy">
                Charge VAT on orders
              </p>
              <p className="text-xs text-navy/55">
                When enabled, the rate below is added to the order total at
                checkout.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={store.vatEnabled}
            onClick={() => set({ vatEnabled: !store.vatEnabled })}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition-colors",
              store.vatEnabled ? "bg-navy" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute top-1 size-5 rounded-full bg-cream shadow transition-all",
                store.vatEnabled ? "left-6" : "left-1"
              )}
            />
          </button>
        </div>
        {store.vatEnabled && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Tax rate (%)">
              <Input
                type="number"
                step="0.1"
                min={0}
                max={100}
                value={store.taxRatePercent}
                onChange={(e) =>
                  set({ taxRatePercent: parseFloat(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
        )}
        <p className="mt-3 text-xs text-navy/50">
          Current status:{" "}
          <span className={cn("font-medium", store.vatEnabled ? "text-success" : "text-navy/70")}>
            {store.vatEnabled
              ? `Enabled · ${store.taxRatePercent}%`
              : "Disabled — no tax charged"}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-navy">
          <Truck className="size-4 text-gold" /> Shipping
        </h2>
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-cream/40 p-4">
          <div className="flex items-center gap-3">
            <Truck className="size-4 text-gold" />
            <div>
              <p className="text-sm font-medium text-navy">
                Charge for shipping
              </p>
              <p className="text-xs text-navy/55">
                When disabled, shipping is free on every order.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={store.shippingEnabled}
            onClick={() => set({ shippingEnabled: !store.shippingEnabled })}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition-colors",
              store.shippingEnabled ? "bg-navy" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute top-1 size-5 rounded-full bg-cream shadow transition-all",
                store.shippingEnabled ? "left-6" : "left-1"
              )}
            />
          </button>
        </div>
        {store.shippingEnabled ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Free shipping over (USD)">
            <Input
              type="number"
              value={store.freeShippingThreshold}
              onChange={(e) =>
                set({
                  freeShippingThreshold: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Field>
          <Field label="Standard shipping (USD)">
            <Input
              type="number"
              step="0.01"
              value={store.standardShippingUsd}
              onChange={(e) =>
                set({
                  standardShippingUsd: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Field>
          <Field label="Express shipping (USD)">
            <Input
              type="number"
              step="0.01"
              value={store.expressShippingUsd}
              onChange={(e) =>
                set({
                  expressShippingUsd: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Field>
        </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-cream/40 p-4 text-center text-sm text-navy/60">
            Shipping is free on every order.
          </p>
        )}
        <p className="mt-3 text-xs text-navy/50">
          Current status:{" "}
          <span className={cn("font-medium", store.shippingEnabled ? "text-success" : "text-navy/70")}>
            {store.shippingEnabled
              ? "Enabled · charges apply"
              : "Disabled — free shipping on all orders"}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-1 font-serif text-xl text-navy">Announcement</h2>
        <p className="mb-4 text-xs text-navy/55">
          Headlines shown in the banner at the top of every page — up to{" "}
          {MAX_ANNOUNCEMENTS}. Edits apply when you press “Save settings”.
        </p>

        {store.announcements.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-cream/40 p-6 text-center text-sm text-navy/60">
            No announcements yet. Add your first headline below.
          </p>
        ) : (
          <ul className="space-y-2">
            {store.announcements.map((text, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-cream/40 p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-cream">
                  {i + 1}
                </span>
                <Input
                  value={text}
                  aria-label={`Edit headline ${i + 1}`}
                  placeholder="e.g. BUY 2 or more — 20% discount"
                  onChange={(e) => {
                    const next = [...store.announcements];
                    next[i] = e.target.value;
                    set({ announcements: next });
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 rounded-full px-3 text-destructive"
                  aria-label={`Delete headline ${i + 1}`}
                  onClick={() =>
                    set({
                      announcements: store.announcements.filter((_, j) => j !== i),
                    })
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {store.announcements.length < MAX_ANNOUNCEMENTS && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => set({ announcements: [...store.announcements, ""] })}
            className="mt-3 rounded-full text-xs"
          >
            <Plus className="me-1.5 size-3" /> Add headline
          </Button>
        )}
      </div>

      <Button
        onClick={save}
        disabled={saving}
        className="rounded-full bg-navy px-8 py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
      >
        <Save className="me-2 size-4" />
        {saving ? "Saving…" : "Save settings"}
      </Button>
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