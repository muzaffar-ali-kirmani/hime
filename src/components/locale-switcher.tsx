"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/lib/locale-provider";
import { CURRENCIES, LANGUAGES, COUNTRIES } from "@/lib/locale";
import type { Currency, Language, Country } from "@/lib/types";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { currency, language, country, setCurrency, setLanguage, setCountry } = useLocale();
  const [open, setOpen] = useState(false);

  const handleCurrency = (c: Currency) => {
    setCurrency(c);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 px-2 text-navy hover:bg-navy/5"
        >
          <Globe className="size-3.5" />
          <span className="text-xs font-medium tracking-wide">
            {LANGUAGES[language].code.toUpperCase()} · {CURRENCIES[currency].code}
          </span>
          <ChevronDown className="size-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-cream">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-navy/60">
          Language
        </DropdownMenuLabel>
        {Object.values(LANGUAGES).map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLanguage(l.code as Language)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{l.native}</span>
              <span className="text-xs text-muted-foreground">{l.name}</span>
            </span>
            {language === l.code && <Check className="size-3.5 text-gold" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-navy/60">
          Currency
        </DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-1 px-1.5 pb-2">
          {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrency(c)}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-navy/5 ${
                currency === c ? "bg-navy/10" : ""
              }`}
            >
              <span className="font-medium">{c}</span>
              <span className="text-muted-foreground">{CURRENCIES[c].symbol}</span>
            </button>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-navy/60">
          Shipping to
        </DropdownMenuLabel>
        {(Object.keys(COUNTRIES) as Country[]).map((c) => (
          <DropdownMenuItem
            key={c}
            onClick={() => {
              setCountry(c);
              setCurrency(COUNTRIES[c].currency);
            }}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🏳️</span>
              <span>{COUNTRIES[c].name}</span>
            </span>
            {country === c && <Check className="size-3.5 text-gold" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}