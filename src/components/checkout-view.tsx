"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, CreditCard, Apple, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice, COUNTRIES, CURRENCIES } from "@/lib/locale";
import { ShopLayout } from "@/components/shop-layout";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Apple },
  { id: "tabby", label: "Tabby · 4 payments", icon: "T" },
  { id: "tamara", label: "Tamara · Pay in 3", icon: "T" },
  { id: "cod", label: "Cash on Delivery", icon: "₪" },
];

export function CheckoutView() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const { currency, country, setCountry, language, t } = useLocale();
  const [step, setStep] = useState<"address" | "payment" | "review">("address");
  const [payment, setPayment] = useState("card");
  const [guestEmail, setGuestEmail] = useState("");
  const [isGuest, setIsGuest] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: COUNTRIES[country].cities[0],
    area: "",
    notes: "",
    saveInfo: true,
  });

  const shipping = cartSubtotal >= 150 ? 0 : 9;
  const tax = cartSubtotal * 0.05;
  const total = cartSubtotal + shipping + tax;

  if (orderComplete) {
    return (
      <ShopLayout>
        <section className="container-wide py-20">
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
              <Check className="size-8 text-gold" />
            </div>
            <h1 className="mt-5 font-serif text-4xl text-navy">Thank you</h1>
            <p className="mt-3 text-sm text-navy/70">
              Your order #LU-{Math.random().toString(36).slice(2, 8).toUpperCase()} has been
              placed. We'll email you as soon as it's hand-finished and ready to ship.
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </ShopLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <ShopLayout>
        <section className="container-wide py-20 text-center">
          <h1 className="font-serif text-4xl text-navy">Your bag is empty</h1>
          <p className="mt-3 text-sm text-navy/60">Add a piece before checking out.</p>
          <Button
            asChild
            className="mt-6 rounded-full bg-navy px-7 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
          >
            <Link href="/shop">Shop Now</Link>
          </Button>
        </section>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <section className="container-wide py-8 sm:py-12">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-1 text-xs text-navy/60 hover:text-navy"
        >
          <ChevronLeft className="size-3.5" /> Back to bag
        </Link>
        <h1 className="font-serif text-4xl text-navy sm:text-5xl">{t("checkout")}</h1>

        {/* Stepper */}
        <div className="my-6 flex items-center gap-3 text-xs">
          {[
              { id: "address", label: "1 · Address" },
              { id: "payment", label: "2 · Payment" },
              { id: "review", label: "3 · Review" },
            ].map((s, i) => {
              const active = step === s.id;
              const passed =
                (s.id === "address" && step !== "address") ||
                (s.id === "payment" && step === "review");
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5",
                    active
                      ? "bg-navy text-cream"
                      : passed
                      ? "bg-gold/10 text-navy"
                      : "bg-card text-navy/50"
                  )}
                >
                  {s.label}
                </div>
              );
            })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Account toggle */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
              <button
                onClick={() => setIsGuest(true)}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 transition-all",
                  isGuest ? "bg-navy text-cream" : "text-navy"
                )}
              >
                Guest checkout
              </button>
              <button
                onClick={() => setIsGuest(false)}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 transition-all",
                  !isGuest ? "bg-navy text-cream" : "text-navy"
                )}
              >
                Sign in
              </button>
            </div>

            {isGuest && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest">
                  Email for order updates
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 rounded-full"
                />
              </div>
            )}

            {step === "address" && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl text-navy">Shipping address</h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    label="First name"
                    value={form.firstName}
                    onChange={(v) => setForm({ ...form, firstName: v })}
                  />
                  <FormField
                    label="Last name"
                    value={form.lastName}
                    onChange={(v) => setForm({ ...form, lastName: v })}
                  />
                </div>
                <FormField
                  label="Phone number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs uppercase tracking-widest">Country</Label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value as never)}
                      className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
                    >
                      {Object.entries(COUNTRIES).map(([id, c]) => (
                        <option key={id} value={id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-widest">City</Label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
                    >
                      {COUNTRIES[country].cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <FormField
                  label="Area / District"
                  value={form.area}
                  onChange={(v) => setForm({ ...form, area: v })}
                  placeholder="e.g. Downtown, Marina"
                />
                <FormField
                  label="Street address"
                  value={form.address1}
                  onChange={(v) => setForm({ ...form, address1: v })}
                />
                <FormField
                  label="Building / Apartment (optional)"
                  value={form.address2}
                  onChange={(v) => setForm({ ...form, address2: v })}
                />
                <div>
                  <Label className="text-xs uppercase tracking-widest">
                    Delivery notes (optional)
                  </Label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Landmarks, gate codes…"
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-3 text-sm"
                  />
                </div>

                <Button
                  onClick={() => setStep("payment")}
                  className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
                >
                  Continue to payment
                </Button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl text-navy">Payment method</h2>

                <div className="grid gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-3 text-sm transition-all",
                        payment === m.id
                          ? "border-navy bg-navy/5 ring-1 ring-gold"
                          : "border-border bg-card hover:border-navy/50"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-xs">
                          {m.id === "tabby"
                            ? "Tabby"
                            : m.id === "tamara"
                            ? "Tamara"
                            : m.id === "cod"
                            ? "COD"
                            : m.id === "apple"
                            ? ""
                            : "Card"}
                        </span>
                        <span className="font-medium text-navy">{m.label}</span>
                      </span>
                      {payment === m.id && <Check className="size-4 text-gold" />}
                    </button>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="space-y-3 rounded-xl border border-border bg-cream/40 p-4">
                    <FormField label="Card number" value="" onChange={() => {}} placeholder="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="MM / YY" value="" onChange={() => {}} placeholder="12 / 28" />
                      <FormField label="CVC" value="" onChange={() => {}} placeholder="123" />
                    </div>
                    <FormField label="Cardholder name" value="" onChange={() => {}} />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("address")}
                    className="rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("review")}
                    className="flex-1 rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
                  >
                    Review order
                  </Button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl text-navy">Review your order</h2>
                <div className="space-y-2 text-sm">
                  <p className="text-navy/70">Ship to:</p>
                  <p className="text-navy">
                    {form.firstName} {form.lastName}
                    <br />
                    {form.address1}
                    {form.address2 ? `, ${form.address2}` : ""}
                    <br />
                    {form.area ? `${form.area}, ` : ""}
                    {form.city}, {COUNTRIES[country].name}
                    <br />
                    {form.phone}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-navy/70">Payment method:</p>
                  <p className="text-navy">
                    {PAYMENT_METHODS.find((m) => m.id === payment)?.label}
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setOrderComplete(true);
                    clearCart();
                  }}
                  className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
                >
                  <Lock className="me-2 size-3.5" /> Place order ·{" "}
                  {formatPrice(total, currency, language)}
                </Button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-xl text-navy">Order summary</h3>
              <ul className="mt-4 space-y-3">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] text-cream">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-navy">{item.name}</p>
                      <p className="text-[10px] capitalize text-navy/60">
                        {item.variant.metal.replace("-", " ")}
                        {item.variant.lengthCm && ` · ${item.variant.lengthCm}cm`}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-navy">
                      {formatPrice(item.unitPrice * item.quantity, currency, language)}
                    </p>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-xs">
                <div className="flex justify-between text-navy/70">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(cartSubtotal, currency, language)}</dd>
                </div>
                <div className="flex justify-between text-navy/70">
                  <dt>Shipping</dt>
                  <dd>
                    {shipping === 0 ? "Free" : formatPrice(shipping, currency, language)}
                  </dd>
                </div>
                <div className="flex justify-between text-navy/70">
                  <dt>VAT (5%)</dt>
                  <dd>{formatPrice(tax, currency, language)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-serif text-base">
                  <dt className="text-navy">Total</dt>
                  <dd className="text-navy">{formatPrice(total, currency, language)}</dd>
                </div>
                <p className="mt-2 text-[10px] text-navy/50">
                  All payments secured by 3D-Secure. Currency:{" "}
                  {CURRENCIES[currency].name}.
                </p>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </ShopLayout>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 rounded-full"
      />
    </div>
  );
}