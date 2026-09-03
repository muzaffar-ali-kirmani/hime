"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Currency, Language, Country } from "./types";
import { LANGUAGES } from "./locale";

interface LocaleContextValue {
  currency: Currency;
  language: Language;
  country: Country;
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
  setCountry: (c: Country) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const translations: Record<string, { en: string; ar: string }> = {
  "shop.now": { en: "Shop Now", ar: "تسوّقي الآن" },
  "buy.now": { en: "Buy Now", ar: "اشتري الآن" },
  "tagline": { en: "Just Made For You", ar: "صُنع من أجلكِ فقط" },
  "free.shipping": { en: "Free shipping over", ar: "شحن مجاني فوق" },
  "search.placeholder": { en: "Search necklaces, bracelets…", ar: "ابحثي عن القلائد، الأساور…" },
  "cart": { en: "Cart", ar: "السلة" },
  "wishlist": { en: "Wishlist", ar: "المفضلة" },
  "account": { en: "Account", ar: "الحساب" },
  "shop.all": { en: "Shop All", ar: "تسوّقي الكل" },
  "create.your.own": { en: "Create Your Own", ar: "صمّمي قطعة خاصة" },
  "new.trending": { en: "New & Trending", ar: "جديد ورائج" },
  "most.gifted": { en: "Most Gifted", ar: "الأكثر إهداءً" },
  "sale": { en: "Sale", ar: "تخفيضات" },
  "add.to.cart": { en: "Add to Cart", ar: "أضيفي للسلة" },
  "added": { en: "Added", ar: "تمت الإضافة" },
  "personalize": { en: "Personalize", ar: "خصّصيها" },
  "engraving": { en: "Engraving", ar: "النقش" },
  "length": { en: "Length", ar: "الطول" },
  "finish": { en: "Finish", ar: "الطلاء" },
  "gemstone": { en: "Gemstone", ar: "حجر كريم" },
  "charms": { en: "Charms", ar: "القلائد الزينة" },
  "live.preview": { en: "Live preview", ar: "معاينة فورية" },
  "save.design": { en: "Save design", ar: "احفظي التصميم" },
  "share.design": { en: "Share design", ar: "شاركي التصميم" },
  "complete.set": { en: "Complete the set", ar: "كمّلي الإطلالة" },
  "free.shipping.threshold": { en: "Add {amount} for free shipping", ar: "أضيفي {amount} للحصول على شحن مجاني" },
  "free.shipping.unlocked": { en: "You've unlocked free shipping", ar: "تمّ تفعيل الشحن المجاني" },
  "checkout": { en: "Checkout", ar: "إتمام الطلب" },
  "subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "shipping.calculated": { en: "Shipping calculated at checkout", ar: "يتم احتساب الشحن عند الطلب" },
  "promo.code": { en: "Promo code", ar: "كود الخصم" },
  "apply": { en: "Apply", ar: "تطبيق" },
  "gift.wrap": { en: "Add gift wrap", ar: "إضافة تغليف هدايا" },
  "gift.note": { en: "Add a gift note", ar: "أضيفي رسالة للهدية" },
  "reviews": { en: "reviews", ar: "تقييم" },
  "made.to.order": { en: "Made to order", ar: "يصنع حسب الطلب" },
  "ships.in": { en: "Ships in {days}", ar: "يُشحن خلال {days}" },
  "size.guide": { en: "Size guide", ar: "دليل المقاسات" },
  "materials": { en: "Materials & Care", ar: "المواد والعناية" },
  "description": { en: "Description", ar: "الوصف" },
  "sign.up.discount": { en: "Get 15% off your first order", ar: "احصلي على خصم 15% على طلبك الأول" },
  "email.placeholder": { en: "Your email address", ar: "عنوان بريدكِ الإلكتروني" },
  "subscribe": { en: "Subscribe", ar: "اشتركي" },
  "trust.handcrafted": { en: "Hand-finished in our atelier", ar: "مصنوعة يدويًا في مشغلنا" },
  "trust.metal": { en: "Hallmarked 18K & 925", ar: "معتمدة 18 قيراط و925" },
  "trust.delivery": { en: "Free Gulf-wide delivery", ar: "شحن مجاني لكافة دول الخليج" },
  "trust.returns": { en: "30-day returns", ar: "إرجاع خلال 30 يوم" },
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("AED");
  const [language, setLanguageState] = useState<Language>("en");
  const [country, setCountryState] = useState<Country>("AE");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hime-locale") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.currency) setCurrencyState(parsed.currency);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.country) setCountryState(parsed.country);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = LANGUAGES[language].dir;
    }
  }, [language]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    persist({ currency: c, language, country });
  };
  const setLanguage = (l: Language) => {
    setLanguageState(l);
    persist({ currency, language: l, country });
  };
  const setCountry = (c: Country) => {
    setCountryState(c);
    persist({ currency, language, country: c });
  };

  const persist = (state: { currency: Currency; language: Language; country: Country }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hime-locale", JSON.stringify(state));
    }
  };

  const t = (key: string) => {
    const found = translations[key];
    if (!found) return key;
    return found[language];
  };

  return (
    <LocaleContext.Provider
      value={{
        currency,
        language,
        country,
        setCurrency,
        setLanguage,
        setCountry,
        t,
        dir: LANGUAGES[language].dir,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}