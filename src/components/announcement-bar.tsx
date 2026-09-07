"use client";

import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { useStore } from "@/lib/store-provider";
import { Truck, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const { currency, t } = useLocale();
  const { settings } = useStore();
  const threshold = formatPrice(settings.freeShippingThreshold, currency);
  const shippingMsg = settings.shippingEnabled
    ? `${t("free.shipping")} ${threshold}`
    : "Free shipping on every order";

  const messages = [
    {
      icon: Truck,
      text: settings.announcement || shippingMsg,
    },
    { icon: Sparkles, text: "Use code WELCOME15 for 15% off your first order" },
    { icon: Truck, text: shippingMsg },
  ];

  return (
    <div className="bg-navy text-cream">
      <div className="container-wide flex items-center justify-center gap-2 overflow-hidden py-2.5 text-[11px] tracking-widest uppercase sm:gap-6 sm:text-xs">
        {messages.map((m, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2">
            <m.icon className="size-3.5" />
            <span className="hidden sm:inline">{m.text}</span>
            <span className="sm:hidden">{i === 0 ? m.text : messages[0].text}</span>
            {i < messages.length - 1 && (
              <span className="mx-2 hidden text-cream/40 sm:inline">·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}