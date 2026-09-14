"use client";

import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { useStore } from "@/lib/store-provider";
import { Truck, Sparkles } from "lucide-react";

const ICONS = [Truck, Sparkles, Truck];

export function AnnouncementBar() {
  const { currency, t } = useLocale();
  const { settings } = useStore();
  const threshold = formatPrice(settings.freeShippingThreshold, currency);
  const shippingMsg = settings.shippingEnabled
    ? `${t("free.shipping")} ${threshold}`
    : "Free shipping on every order";

  // Headlines come from Settings (max 3). Fall back to the shipping message
  // when no announcement has been configured.
  const messages: string[] =
    settings.announcements && settings.announcements.length > 0
      ? settings.announcements.slice(0, 3)
      : [shippingMsg];

  return (
    <div className="bg-navy text-cream">
      <div className="container-wide flex items-center justify-center gap-2 overflow-hidden py-2.5 text-[11px] tracking-widest uppercase sm:gap-6 sm:text-xs">
        {messages.map((text, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={i} className="flex shrink-0 items-center gap-2">
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{text}</span>
              <span className="sm:hidden">{i === 0 ? text : messages[0]}</span>
              {i < messages.length - 1 && (
                <span className="mx-2 hidden text-cream/40 sm:inline">·</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}