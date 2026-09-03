"use client";

import { useState } from "react";
import { Save, Mail, Phone, Globe, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: "Hime",
    email: "hello@hime.jewellery",
    phone: "+971 50 000 0000",
    whatsapp: "+971 50 000 0000",
    instagram: "@hime.jewellery",
    freeShippingThreshold: 150,
    standardShippingUsd: 9,
    expressShippingUsd: 18,
    taxRatePercent: 5,
    announcement: "Free Gulf-wide delivery on every order",
  });
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      toast.success("Settings saved (local — wire to /api/admin/settings)");
      setSaving(false);
    }, 500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-navy/60">
          Store contact info, shipping rules, and announcements.
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
              onChange={(e) => setStore({ ...store, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              value={store.email}
              onChange={(e) => setStore({ ...store, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={store.phone}
              onChange={(e) => setStore({ ...store, phone: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp">
            <Input
              value={store.whatsapp}
              onChange={(e) => setStore({ ...store, whatsapp: e.target.value })}
            />
          </Field>
          <Field label="Instagram">
            <Input
              value={store.instagram}
              onChange={(e) => setStore({ ...store, instagram: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-serif text-xl text-navy">Shipping & tax</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Free shipping over (USD)">
            <Input
              type="number"
              value={store.freeShippingThreshold}
              onChange={(e) =>
                setStore({
                  ...store,
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
                setStore({
                  ...store,
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
                setStore({
                  ...store,
                  expressShippingUsd: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Field>
          <Field label="Tax rate (%)">
            <Input
              type="number"
              step="0.1"
              value={store.taxRatePercent}
              onChange={(e) =>
                setStore({
                  ...store,
                  taxRatePercent: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-serif text-xl text-navy">Announcement</h2>
        <Field label="Site-wide banner text">
          <Input
            value={store.announcement}
            onChange={(e) => setStore({ ...store, announcement: e.target.value })}
          />
        </Field>
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