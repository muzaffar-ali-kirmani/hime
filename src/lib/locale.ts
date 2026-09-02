import type { Currency, Language, Country } from "./types";

export const CURRENCIES: Record<
  Currency,
  { symbol: string; rate: number; name: string; code: string; flag: string }
> = {
  AED: { symbol: "AED", rate: 3.673, name: "UAE Dirham", code: "AED", flag: "AE" },
  SAR: { symbol: "SAR", rate: 3.75, name: "Saudi Riyal", code: "SAR", flag: "SA" },
  QAR: { symbol: "QAR", rate: 3.64, name: "Qatari Riyal", code: "QAR", flag: "QA" },
  KWD: { symbol: "KWD", rate: 0.307, name: "Kuwaiti Dinar", code: "KWD", flag: "KW" },
  BHD: { symbol: "BHD", rate: 0.376, name: "Bahraini Dinar", code: "BHD", flag: "BH" },
  OMR: { symbol: "OMR", rate: 0.384, name: "Omani Rial", code: "OMR", flag: "OM" },
  USD: { symbol: "$", rate: 1, name: "US Dollar", code: "USD", flag: "US" },
};

export const LANGUAGES: Record<Language, { code: Language; name: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { code: "en", name: "English", native: "English", dir: "ltr" },
  ar: { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" },
};

export const COUNTRIES: Record<
  Country,
  { name: string; currency: Currency; cities: string[] }
> = {
  AE: {
    name: "United Arab Emirates",
    currency: "AED",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  },
  SA: {
    name: "Saudi Arabia",
    currency: "SAR",
    cities: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
  },
  QA: { name: "Qatar", currency: "QAR", cities: ["Doha", "Al Rayyan", "Al Wakrah"] },
  KW: { name: "Kuwait", currency: "KWD", cities: ["Kuwait City", "Hawalli", "Salmiya"] },
  BH: { name: "Bahrain", currency: "BHD", cities: ["Manama", "Riffa", "Muharraq"] },
  OM: { name: "Oman", currency: "OMR", cities: ["Muscat", "Salalah", "Sohar"] },
};

export const FREE_SHIPPING_THRESHOLD_USD = 150;
export const STANDARD_SHIPPING_USD = 9;
export const EXPRESS_SHIPPING_USD = 18;

export function formatPrice(
  amountUsd: number,
  currency: Currency,
  language: Language = "en"
) {
  const { symbol, rate, code } = CURRENCIES[currency];
  const converted = amountUsd * rate;
  const formatted = new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: code === "KWD" || code === "BHD" || code === "OMR" ? 3 : 2,
    maximumFractionDigits: 3,
  }).format(converted);
  return `${symbol} ${formatted}`;
}