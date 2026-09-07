"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Ticket,
  Copy,
  Check,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromoCode {
  code: string;
  type: "percent" | "fixed";
  amount: number;
  minOrderUsd: number;
  isActive: boolean;
  expiresAt: string | null;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [amount, setAmount] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [expires, setExpires] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo-codes", { credentials: "include" });
      const data = await res.json();
      setPromoCodes(data.promoCodes || []);
    } catch {
      toast.error("Could not load promo codes");
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addCode() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a discount amount greater than 0");
      return;
    }
    if (type === "percent" && amt > 100) {
      toast.error("Percent discount cannot exceed 100");
      return;
    }
    if (code.trim().length < 3) {
      toast.error("Code must be at least 3 characters");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          amount: amt,
          minOrderUsd: minOrder ? parseFloat(minOrder) : 0,
          expiresAt: expires ? new Date(expires).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not create code");
        return;
      }
      toast.success(`Code ${data.code} created`);
      setCode("");
      setAmount("");
      setMinOrder("");
      setExpires("");
      load();
    } catch {
      toast.error("Could not create code");
    } finally {
      setAdding(false);
    }
  }

  const toggleActive = useCallback(async function (p: PromoCode) {
    try {
      const res = await fetch(`/api/admin/promo-codes/${p.code}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Could not update code");
        return;
      }
      toast.success(p.isActive ? `${p.code} disabled` : `${p.code} enabled`);
      load();
    } catch {
      toast.error("Could not update code");
    }
  }, []);

  async function removeCode(p: PromoCode) {
    try {
      const res = await fetch(`/api/admin/promo-codes/${p.code}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Could not delete code");
        return;
      }
      toast.success(`${p.code} deleted`);
      load();
    } catch {
      toast.error("Could not delete code");
    }
  }

  function copyCode(c: string) {
    navigator.clipboard.writeText(c);
    setCopied(c);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Promo Codes</h1>
        <p className="mt-1 text-sm text-navy/60">
          {promoCodes.filter((p) => p.isActive).length} active ·{" "}
          {promoCodes.length} total
        </p>
      </div>

      {/* Add form */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Ticket className="size-4 text-gold" />
          <h2 className="font-serif text-lg text-navy">Add a promo code</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-navy/70">Discount type</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setType("percent")}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm transition-colors",
                  type === "percent"
                    ? "border-navy bg-navy text-cream"
                    : "border-border bg-card text-navy hover:border-navy/40"
                )}
              >
                % off
              </button>
              <button
                onClick={() => setType("fixed")}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm transition-colors",
                  type === "fixed"
                    ? "border-navy bg-navy text-cream"
                    : "border-border bg-card text-navy hover:border-navy/40"
                )}
              >
                Fixed $
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-navy/70">
              {type === "percent" ? "Percent off (1–100)" : "Amount off (USD)"}
            </Label>
            <Input
              type="number"
              min="0"
              step="0.5"
              placeholder={type === "percent" ? "e.g. 15" : "e.g. 10"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-navy/70">
              Minimum order (USD, optional)
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="0 = no minimum"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-navy/70">Expiry (optional)</Label>
            <Input
              type="date"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-navy/70">Code</Label>
            <Input
              className="font-mono uppercase tracking-wider"
              placeholder="EID20"
              maxLength={24}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <p className="mt-1 text-xs text-navy/50">
              3–24 characters, letters, numbers and dashes only.
            </p>
          </div>
        </div>

        <Button
          onClick={addCode}
          disabled={adding}
          className="mt-4 rounded-full bg-navy text-cream hover:bg-navy/90"
        >
          <Plus className="me-1.5 size-4" />
          {adding ? "Creating…" : "Create promo code"}
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-navy/60">Loading…</p>
      ) : promoCodes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm text-navy/60">
            No promo codes yet. Create your first one above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {promoCodes.map((p) => {
            const expired =
              p.expiresAt && new Date(p.expiresAt) < new Date();
            return (
              <div
                key={p.code}
                className={cn(
                  "rounded-2xl border bg-card p-5",
                  p.isActive ? "border-border" : "border-border bg-card/50"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyCode(p.code)}
                        className="group flex items-center gap-2 rounded-lg bg-navy/5 px-2.5 py-1 font-mono text-sm font-semibold tracking-wider text-navy hover:bg-navy/10"
                        title="Copy code"
                      >
                        {p.code}
                        {copied === p.code ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <Copy className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                        )}
                      </button>
                      {p.isActive && !expired && (
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] uppercase tracking-widest text-success">
                          Active
                        </span>
                      )}
                      {!p.isActive && (
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-navy/60">
                          Disabled
                        </span>
                      )}
                      {expired && (
                        <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[9px] uppercase tracking-widest text-destructive">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-navy/80">
                      {p.type === "percent"
                        ? `${fmt(p.amount)}% off`
                        : `$${fmt(p.amount)} off`}
                      {p.minOrderUsd > 0 && ` · min order $${fmt(p.minOrderUsd)}`}
                      {p.expiresAt && (
                        <span className="ms-2 inline-flex items-center gap-1 text-navy/50">
                          <CalendarDays className="size-3" />
                          expires {new Date(p.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.isActive}
                        onCheckedChange={() => toggleActive(p)}
                        aria-label={`Toggle ${p.code}`}
                      />
                      <span className="text-xs text-navy/60">
                        {p.isActive ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <ConfirmDialog
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      }
                      title={`Delete ${p.code}?`}
                      description="Customers will no longer be able to use this promo code. This cannot be undone."
                      confirmLabel="Delete"
                      destructive
                      onConfirm={() => removeCode(p)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
