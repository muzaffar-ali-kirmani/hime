"use client";

import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { useLocale } from "@/lib/locale-provider";
import { useStore } from "@/lib/store-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLocale();
  const { settings } = useStore();

  const columns = [
    {
      title: "Shop",
      links: [
        { label: "Necklaces", href: "/shop/necklaces" },
        { label: "Bracelets", href: "/shop/bracelets" },
        { label: "Rings", href: "/shop/rings" },
        { label: "Earrings", href: "/shop/earrings" },
        { label: "Anklets", href: "/shop/anklets" },
      ],
    },
    {
      title: "Brand",
      links: [
        { label: "Our Story", href: "/about" },
        // Hidden for now — re-enable to restore the footer link
        // { label: "Create Your Own", href: "/customize" },
        { label: "Sustainability", href: "/about#craft" },
        { label: "Jewellery Club", href: "/club" },
        { label: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Delivery", href: "/shipping" },
        { label: "Size Guide", href: "/size-guide" },
        { label: "Jewellery Care", href: "/care" },
        { label: "Track Order", href: "/account/orders" },
        { label: "Contact / WhatsApp", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border/50 bg-cream">
      <div className="container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Newsletter */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl text-navy">Hime</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-navy/70">
              Premium personalised jewellery, made by hand and made for her story.
              Designed in the Gulf, crafted to last.
            </p>
            <form className="space-y-3">
              <></>
              <div className="flex max-w-sm gap-2">
                <Input
                  type="email"
                  placeholder={t("email.placeholder")}
                  className="rounded-full border-border bg-card"
                />
                <Button
                  type="submit"
                  className="rounded-full bg-navy px-5 text-cream hover:bg-navy/90"
                >
                  {t("subscribe")}
                </Button>
              </div>
            </form>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-border p-2 text-navy/70 transition-colors hover:border-navy hover:text-navy"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={settings.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-border p-2 text-navy/70 transition-colors hover:border-navy hover:text-navy"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={settings.tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-full border border-border p-2 text-navy/70 transition-colors hover:border-navy hover:text-navy"
              >
                <TikTokIcon className="size-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-border p-2 text-navy/70 transition-colors hover:border-navy hover:text-navy"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-navy">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy/70 transition-colors hover:text-navy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/40 pt-8 text-xs text-navy/70 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <span className="text-gold">✦</span> Free Gulf Shipping
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">✦</span> Hypoallergenic
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 text-xs text-navy/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hime Jewellery. All rights reserved.</p>
          {/* Payment badges hidden for now — re-enable when card/BNPL methods return
          <div className="flex items-center gap-3">
            <span className="rounded border border-border bg-card px-2 py-1">VISA</span>
            <span className="rounded border border-border bg-card px-2 py-1">Mastercard</span>
            <span className="rounded border border-border bg-card px-2 py-1">Apple Pay</span>
            <span className="rounded border border-border bg-card px-2 py-1">Tabby</span>
            <span className="rounded border border-border bg-card px-2 py-1">Tamara</span>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
}