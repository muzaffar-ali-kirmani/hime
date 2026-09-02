"use client";

import { ShopLayout } from "@/components/shop-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            We're here
          </p>
          <h1 className="font-serif text-5xl text-navy">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy/65">
            WhatsApp us for the fastest response, or send a note below —
            we usually reply within 4 hours.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <ContactCard
              icon={MessageCircle}
              title="WhatsApp"
              detail="+971 50 000 0000"
              sub="Mon–Sat · 9am–9pm GST"
              cta="Chat now"
              href="https://wa.me/971500000000"
            />
            <ContactCard
              icon={Mail}
              title="Email"
              detail="hello@lune.jewellery"
              sub="Reply within 4 hours"
              cta="Send email"
              href="mailto:hello@lune.jewellery"
            />
            <ContactCard
              icon={MapPin}
              title="Atelier"
              detail="Alserkal Avenue, Dubai"
              sub="By appointment only"
              cta="Book a visit"
              href="#"
            />
            <ContactCard
              icon={Clock}
              title="Hours"
              detail="Mon–Sat · 9am–9pm"
              sub="Closed on UAE public holidays"
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                  <MessageCircle className="size-6 text-gold" />
                </div>
                <p className="font-serif text-2xl text-navy">Message sent</p>
                <p className="text-sm text-navy/65">
                  We'll be in touch within 4 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <h2 className="font-serif text-2xl text-navy">Send a message</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name" required />
                  <Field label="Email" type="email" required />
                </div>
                <Field label="Order number (optional)" />
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-navy/60">
                    How can we help?
                  </label>
                  <Textarea
                    placeholder="Tell us a little about what you need…"
                    rows={5}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
                >
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}

function Field({
  label,
  type = "text",
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-navy/60">
        {label}
      </label>
      <Input
        type={type}
        required={required}
        className="mt-1 rounded-full"
      />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  detail,
  sub,
  cta,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  sub: string;
  cta?: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="rounded-full bg-gold/15 p-3">
        <Icon className="size-5 text-gold" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-navy">{title}</p>
        <p className="text-sm text-navy">{detail}</p>
        <p className="text-xs text-navy/55">{sub}</p>
      </div>
      {cta && href && (
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {cta}
          </a>
        </Button>
      )}
    </div>
  );
}