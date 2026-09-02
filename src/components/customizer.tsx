"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Share2,
  Heart,
  Save,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import type { MetalFinish, Gemstone, ProductCategory } from "@/lib/types";
import { GEMSTONES, ENGRAVING_FONTS, CHARMS, PRODUCTS } from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "base", label: "Base" },
  { id: "metal", label: "Finish" },
  { id: "details", label: "Personalize" },
  { id: "preview", label: "Review" },
];

const BASE_OPTIONS: { id: ProductCategory; label: string; image: string }[] = [
  { id: "necklaces", label: "Necklace", image: "linear-gradient(135deg, #E8D9B8, #C9A66B)" },
  { id: "bracelets", label: "Bracelet", image: "linear-gradient(135deg, #F4D4C4, #B8866F)" },
  { id: "rings", label: "Ring", image: "linear-gradient(135deg, #E8D9B8, #A88A4D)" },
  { id: "earrings", label: "Earrings", image: "linear-gradient(135deg, #F0F0F0, #A8A8A8)" },
];

const METALS: { id: MetalFinish; label: string; price: number; swatch: string }[] = [
  { id: "gold", label: "18K Gold", price: 0, swatch: "linear-gradient(135deg, #E8D9B8, #A88A4D)" },
  { id: "rose-gold", label: "Rose Gold", price: 15, swatch: "linear-gradient(135deg, #F4D4C4, #B8866F)" },
  { id: "silver", label: "925 Silver", price: -25, swatch: "linear-gradient(135deg, #F0F0F0, #A8A8A8)" },
];

const LENGTHS = [40, 45, 50, 55];
const SIZES = ["5", "6", "7", "8"];

export function Customizer() {
  const { currency, language, t } = useLocale();
  const { addToCart, saveDesign } = useStore();
  const [step, setStep] = useState(0);
  const [base, setBase] = useState<ProductCategory>("necklaces");
  const [metal, setMetal] = useState<MetalFinish>("gold");
  const [length, setLength] = useState(45);
  const [size, setSize] = useState("6");
  const [engraving, setEngraving] = useState("");
  const [gemstone, setGemstone] = useState<Gemstone | null>(null);
  const [charms, setCharms] = useState<string[]>([]);
  const [font, setFont] = useState("classic");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const basePrice = 149;
  const totalPrice = useMemo(() => {
    let p = basePrice;
    p += METALS.find((m) => m.id === metal)!.price;
    if (gemstone) p += 25;
    if (charms.length) p += charms.length * 22;
    return p;
  }, [metal, gemstone, charms]);

  const toggleCharm = (id: string) =>
    setCharms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleAddToCart = () => {
    const variant = {
      id: `${metal}-${base === "rings" ? size : length}`,
      metal,
      lengthCm: base === "rings" ? undefined : length,
      size: base === "rings" ? size : undefined,
      price: basePrice + (METALS.find((m) => m.id === metal)!.price),
      inStock: true,
    };
    addToCart({
      productId: `custom-${Date.now()}`,
      productSlug: "custom-design",
      name: `Custom ${base.charAt(0).toUpperCase() + base.slice(1, -1)}`,
      image: `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23F7F3EB'/%3E%3Ccircle cx='300' cy='320' r='110' fill='%23C9A66B' opacity='0.5'/%3E%3C/svg%3E`,
      variant,
      personalization: {
        engravingText: engraving || undefined,
        gemstone: gemstone || undefined,
        charmIds: charms.length ? charms : undefined,
      },
      quantity: 1,
      unitPrice: totalPrice,
    });
  };

  const handleSave = () => {
    saveDesign({
      id: `d-${Date.now()}`,
      productId: "custom",
      productName: `Custom ${base}`,
      config: {
        base,
        metal,
        length: String(length),
        size,
        engraving,
        gemstone: gemstone || "",
        charms: charms.join(","),
        font,
      },
      createdAt: Date.now(),
    });
    setSavedMsg("Design saved to your account");
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/customize?metal=${metal}&base=${base}&engraving=${encodeURIComponent(engraving)}&gemstone=${gemstone || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Lune design",
          text: "Look at the piece I designed on Lune",
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setSavedMsg("Link copied to clipboard");
      setTimeout(() => setSavedMsg(null), 2500);
    }
  };

  return (
    <section className="container-wide py-10 lg:py-14">
      {/* Stepper */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          {t("create.your.own")}
        </p>
        <h1 className="font-serif text-4xl text-navy sm:text-5xl">
          Design a piece just for her.
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all",
                step === i
                  ? "bg-navy text-cream"
                  : step > i
                  ? "border border-gold/40 bg-gold/10 text-navy"
                  : "border border-border bg-card text-navy/50"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  step === i
                    ? "bg-gold text-navy"
                    : step > i
                    ? "bg-navy text-cream"
                    : "bg-border text-navy/60"
                )}
              >
                {step > i ? <Check className="size-3" /> : i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cream via-sand to-blush p-8 sm:p-12">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl bg-cream shadow-[0_30px_60px_-20px_rgba(29,42,68,0.18)]">
              <Image
                src={`data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='m' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='${metal === "gold" ? "%23E8D9B8" : metal === "rose-gold" ? "%23F4D4C4" : "%23F0F0F0"}'/%3E%3Cstop offset='1' stop-color='${metal === "gold" ? "%23A88A4D" : metal === "rose-gold" ? "%23B8866F" : "%23A8A8A8"}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' fill='%23F7F3EB'/%3E%3Ccircle cx='300' cy='260' r='80' fill='url(%23m)'/%3E%3Crect x='280' y='260' width='40' height='200' fill='url(%23m)' rx='4'/%3E%3Ccircle cx='300' cy='460' r='15' fill='url(%23m)'/%3E%3Ctext x='300' y='520' font-family='Cormorant Garamond' font-size='14' fill='%231D2A44' text-anchor='middle' letter-spacing='4' opacity='0.5'%3ELUNE%3C/text%3E%3C/svg%3E`}
                alt="Live preview"
                fill
                unoptimized
                className="object-cover"
              />
              {engraving && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-32">
                  <span
                    className={cn(
                      "text-3xl text-navy/90 sm:text-5xl",
                      font === "script" && "font-serif italic",
                      font === "block" && "font-mono"
                    )}
                    style={{
                      fontFamily:
                        font === "script"
                          ? "var(--font-cormorant), serif"
                          : font === "block"
                          ? "ui-monospace, monospace"
                          : "var(--font-cormorant), serif",
                    }}
                  >
                    {engraving}
                  </span>
                </div>
              )}
              {gemstone && (
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: "32%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="size-7 rounded-full ring-2 ring-cream shadow-lg sm:size-9"
                    style={{
                      background: GEMSTONES.find((g) => g.id === gemstone)?.hex,
                    }}
                  />
                </div>
              )}
              {charms.length > 0 && (
                <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1.5">
                  {charms.map((cId) => {
                    const c = CHARMS.find((c) => c.id === cId);
                    if (!c) return null;
                    return (
                      <span
                        key={cId}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/90 text-sm shadow-sm backdrop-blur-sm"
                      >
                        {c.symbol}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-navy/60">
              <span>Live preview · {t("live.preview")}</span>
              <span>{formatPrice(totalPrice, currency, language)}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {step === 0 && (
            <Step title="Choose your base" subtitle="What are we making today?">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BASE_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBase(b.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                      base === b.id
                        ? "border-navy bg-navy/5 ring-2 ring-gold"
                        : "border-border bg-card hover:border-navy"
                    )}
                  >
                    <span
                      className="size-14 rounded-full"
                      style={{ background: b.image }}
                    />
                    <span className="text-sm font-medium text-navy">{b.label}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <>
              <Step title="Choose your finish" subtitle="Metal and length, tailored to her.">
                <div className="grid gap-2 sm:grid-cols-3">
                  {METALS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetal(m.id)}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all",
                        metal === m.id
                          ? "border-navy bg-navy/5 ring-2 ring-gold"
                          : "border-border bg-card hover:border-navy"
                      )}
                    >
                      <span
                        className="size-12 rounded-full"
                        style={{ background: m.swatch }}
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium text-navy">{m.label}</p>
                        <p className="text-[10px] text-navy/60">
                          {m.price > 0 ? `+$${m.price}` : m.price < 0 ? `$${m.price}` : "Base price"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Step>

              {base !== "rings" ? (
                <Step title="Length" subtitle="Standard chain/bracelet sizes in cm.">
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLength(l)}
                        className={cn(
                          "min-w-[64px] rounded-full border px-4 py-2 text-sm transition-all",
                          length === l
                            ? "border-navy bg-navy text-cream"
                            : "border-border bg-card text-navy hover:border-navy"
                        )}
                      >
                        {l} cm
                      </button>
                    ))}
                  </div>
                </Step>
              ) : (
                <Step title="Ring size" subtitle="Match a ring that already fits her.">
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cn(
                          "min-w-[64px] rounded-full border px-4 py-2 text-sm transition-all",
                          size === s
                            ? "border-navy bg-navy text-cream"
                            : "border-border bg-card text-navy hover:border-navy"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Step>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Step title="Engraving" subtitle="Up to 12 characters, made just for her.">
                <Input
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, 12))}
                  maxLength={12}
                  placeholder="Her name, initial, secret word…"
                  className="rounded-full bg-card"
                />
                {engraving && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ENGRAVING_FONTS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFont(f.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs",
                          font === f.id
                            ? "border-navy bg-navy text-cream"
                            : "border-border bg-card text-navy"
                        )}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </Step>

              <Step title="Birthstone" subtitle="A gemstone in her birth month.">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setGemstone(null)}
                    className={cn(
                      "size-10 rounded-full border-2 transition-all",
                      !gemstone
                        ? "border-navy ring-2 ring-gold ring-offset-2 ring-offset-cream"
                        : "border-border"
                    )}
                  >
                    <span className="block text-xs text-navy/50">×</span>
                  </button>
                  {GEMSTONES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGemstone(g.id)}
                      title={`${g.name} · ${g.birthMonth} · +$25`}
                      className={cn(
                        "size-10 rounded-full border-2 transition-all",
                        gemstone === g.id
                          ? "border-navy ring-2 ring-gold ring-offset-2 ring-offset-cream"
                          : "border-border"
                      )}
                      style={{ background: g.hex }}
                      aria-label={g.name}
                    />
                  ))}
                </div>
              </Step>

              <Step title="Add charms" subtitle="Mix & match — each one tells a story.">
                <div className="flex flex-wrap gap-2">
                  {CHARMS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCharm(c.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-all",
                        charms.includes(c.id)
                          ? "border-navy bg-navy text-cream"
                          : "border-border bg-card text-navy hover:border-navy"
                      )}
                    >
                      <span className="text-base">{c.symbol}</span>
                      <span>{c.name}</span>
                      <span className="text-[10px] opacity-60">+${c.price}</span>
                    </button>
                  ))}
                </div>
              </Step>
            </>
          )}

          {step === 3 && (
            <Step title="Review your design" subtitle="Hand-finished in 5–7 days.">
              <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
                <Row label="Base" value={base.charAt(0).toUpperCase() + base.slice(1, -1)} />
                <Row label="Finish" value={METALS.find((m) => m.id === metal)!.label} />
                <Row
                  label={base === "rings" ? "Size" : "Length"}
                  value={base === "rings" ? size : `${length} cm`}
                />
                {engraving && (
                  <Row
                    label="Engraving"
                    value={`"${engraving}" · ${ENGRAVING_FONTS.find((f) => f.id === font)?.name}`}
                  />
                )}
                {gemstone && (
                  <Row
                    label="Birthstone"
                    value={GEMSTONES.find((g) => g.id === gemstone)?.name || ""}
                  />
                )}
                {charms.length > 0 && (
                  <Row
                    label="Charms"
                    value={charms
                      .map((c) => CHARMS.find((c2) => c2.id === c)?.name)
                      .join(", ")}
                  />
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-navy/60">
                      Total
                    </span>
                    <span className="font-serif text-2xl text-navy">
                      {formatPrice(totalPrice, currency, language)}
                    </span>
                  </div>
                </div>
              </div>
            </Step>
          )}

          {/* Footer controls */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-full"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step === STEPS.length - 1}
              className="flex-1 rounded-full bg-navy text-cream hover:bg-navy/90"
            >
              Continue <ArrowRight className="ms-2 size-3.5" />
            </Button>
          </div>

          {step === STEPS.length - 1 && (
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Button
                onClick={handleAddToCart}
                className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
              >
                <ShoppingBag className="me-2 size-4" /> Add to cart ·{" "}
                {formatPrice(totalPrice, currency, language)}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="flex-1 rounded-full text-xs uppercase tracking-widest"
                >
                  <Save className="me-2 size-3.5" /> Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 rounded-full text-xs uppercase tracking-widest"
                >
                  <Share2 className="me-2 size-3.5" /> Share
                </Button>
              </div>
            </div>
          )}

          {savedMsg && (
            <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-navy">
              <Sparkles className="me-2 inline size-3.5 text-gold" />
              {savedMsg}
            </div>
          )}

          <p className="text-center text-xs text-navy/50">
            ✨ Handcrafted to order · 5–7 day production · Free Gulf shipping
          </p>
        </div>
      </div>
    </section>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-cream/50 p-5 sm:p-6">
      <h3 className="font-serif text-2xl text-navy">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-navy/60">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[11px] uppercase tracking-widest text-navy/60">{label}</span>
      <span className="text-right text-navy">{value}</span>
    </div>
  );
}