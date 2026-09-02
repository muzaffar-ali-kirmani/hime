"use client";

import { useLocale } from "@/lib/locale-provider";
import { formatPrice, FREE_SHIPPING_THRESHOLD_USD } from "@/lib/locale";
import { Truck, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const { currency, t } = useLocale();
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD_USD, currency);

  const messages = [
    { icon: Truck, text: `${t("free.shipping")} ${threshold}` },
    { icon: Sparkles, text: "Use code WELCOME15 for 15% off your first order" },
    { icon: Truck, text: "Free Gulf-wide delivery on every order" },
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