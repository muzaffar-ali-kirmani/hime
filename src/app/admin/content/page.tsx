"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS = [
  { key: "hero_title", title: "Hero title", default: "Just made" },
  { key: "hero_subtitle", title: "Hero subtitle", default: "For you." },
  { key: "create_own", title: "Create Your Own banner" },
  { key: "announcement", title: "Announcement bar" },
];

export default function AdminContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/homepage", { credentials: "include" });
    const data = await res.json();
    setSections(data.sections || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upsertPreset(preset: typeof PRESETS[0]) {
    setSaving(preset.key);
    try {
      await fetch("/api/admin/homepage", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: preset.key }),
      });
      toast.success("Section ready to edit");
      load();
    } finally {
      setSaving(null);
    }
  }

  async function save(s: any) {
    setSaving(s.id);
    try {
      await fetch(`/api/admin/homepage/${s.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      toast.success("Saved");
      load();
    } finally {
      setSaving(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this section?")) return;
    await fetch(`/api/admin/homepage/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Homepage</h1>
        <p className="mt-1 text-sm text-navy/60">
          Edit the content of your homepage sections.
        </p>
      </div>

      {/* Quick presets */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-xl text-navy">Quick start</h2>
        <p className="mt-1 text-xs text-navy/60">
          Add a preset to start editing. You can customize any field below.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant="outline"
              onClick={() => upsertPreset(p)}
              disabled={saving === p.key}
              className="rounded-full text-xs"
            >
              <Plus className="me-1.5 size-3" /> {p.title}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-navy/60">Loading…</p>
      ) : (
        <div className="space-y-4">
          {sections.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-navy/60">
              No sections yet. Add one above to get started.
            </p>
          )}
          {sections.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-navy/60">
                    {s.sectionKey}
                  </p>
                  <h3 className="font-serif text-lg text-navy">
                    {s.title || "(no title)"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-navy/70">
                    <input
                      type="checkbox"
                      checked={s.isActive}
                      onChange={(e) => {
                        const updated = { ...s, isActive: e.target.checked };
                        setSections((prev) =>
                          prev.map((x) => (x.id === s.id ? updated : x))
                        );
                        save(updated);
                      }}
                      className="accent-navy"
                    />
                    Active
                  </label>
                  <Button
                    size="sm"
                    onClick={() => save(s)}
                    disabled={saving === s.id}
                    className="rounded-full bg-navy text-cream hover:bg-navy/90"
                  >
                    <Save className="me-1.5 size-3" />
                    {saving === s.id ? "Saving" : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(s.id)}
                    className="rounded-full text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <Input
                    value={s.title || ""}
                    onChange={(e) => {
                      const updated = { ...s, title: e.target.value };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                  />
                </Field>
                <Field label="Subtitle">
                  <Input
                    value={s.subtitle || ""}
                    onChange={(e) => {
                      const updated = { ...s, subtitle: e.target.value };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Body">
                    <Textarea
                      value={s.body || ""}
                      onChange={(e) => {
                        const updated = { ...s, body: e.target.value };
                        setSections((prev) =>
                          prev.map((x) => (x.id === s.id ? updated : x))
                        );
                      }}
                      rows={3}
                    />
                  </Field>
                </div>
                <Field label="Image URL">
                  <Input
                    value={s.imageUrl || ""}
                    onChange={(e) => {
                      const updated = { ...s, imageUrl: e.target.value };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Sort order">
                  <Input
                    type="number"
                    value={s.sortOrder}
                    onChange={(e) => {
                      const updated = {
                        ...s,
                        sortOrder: parseInt(e.target.value) || 0,
                      };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                  />
                </Field>
                <Field label="CTA label">
                  <Input
                    value={s.ctaLabel || ""}
                    onChange={(e) => {
                      const updated = { ...s, ctaLabel: e.target.value };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                    placeholder="Shop now"
                  />
                </Field>
                <Field label="CTA link">
                  <Input
                    value={s.ctaHref || ""}
                    onChange={(e) => {
                      const updated = { ...s, ctaHref: e.target.value };
                      setSections((prev) =>
                        prev.map((x) => (x.id === s.id ? updated : x))
                      );
                    }}
                    placeholder="/shop"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
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