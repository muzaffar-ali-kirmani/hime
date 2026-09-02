"use client";

import { useState } from "react";
import { Mail, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterModule() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="container-wide py-16 sm:py-20">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy to-navy/95 px-6 py-14 text-cream sm:px-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
              Stay in the loop
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-cream sm:text-5xl">
              Stories, drops & 15% off.
            </h2>
            <p className="mx-auto max-w-md text-sm text-cream/70 lg:mx-0">
              Sign up with email or WhatsApp to receive first dibs on new
              collections and a welcome gift.
            </p>
          </div>
          {subscribed ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center lg:items-start lg:text-left">
              <Check className="size-7 text-gold" />
              <p className="font-serif text-2xl text-cream">You're in.</p>
              <p className="text-sm text-cream/70">
                Check your inbox — your 15% code is on its way.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/60" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="h-12 rounded-full border-cream/30 bg-cream/95 pl-11 text-navy placeholder:text-navy/40"
                />
              </div>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/60" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Or your WhatsApp number"
                  className="h-12 rounded-full border-cream/30 bg-cream/95 pl-11 text-navy placeholder:text-navy/40"
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-gold text-xs uppercase tracking-widest text-navy hover:bg-gold/90"
              >
                Get 15% Off
              </Button>
              <p className="text-[10px] text-cream/50">
                By signing up you agree to receive marketing messages. Unsubscribe
                anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}