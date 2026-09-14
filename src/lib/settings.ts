export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  freeShippingThreshold: number;
  standardShippingUsd: number;
  expressShippingUsd: number;
  shippingEnabled: boolean;
  vatEnabled: boolean;
  taxRatePercent: number;
  /** Announcement bar headlines (max 3). */
  announcements: string[];
}

export const DEFAULT_SETTINGS: StoreSettings = {
  name: "Hime",
  email: "hello@hime.jewellery",
  phone: "+971 50 000 0000",
  whatsapp: "+971 50 000 0000",
  instagram: "https://instagram.com/hime.jewellery",
  facebook: "https://facebook.com/hime.jewellery",
  tiktok: "https://tiktok.com/@hime.jewellery",
  freeShippingThreshold: 150,
  standardShippingUsd: 9,
  expressShippingUsd: 18,
  shippingEnabled: true,
  vatEnabled: true,
  taxRatePercent: 5,
  announcements: ["Free Gulf-wide delivery on every order"],
};

export const MAX_ANNOUNCEMENTS = 3;

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof StoreSettings)[];

/** Deserialize a stored value from the settings table into the typed shape. */
export function parseSetting(key: keyof StoreSettings, raw: string): unknown {
  const fallback = DEFAULT_SETTINGS[key];
  if (typeof fallback === "boolean") return raw === "true";
  if (typeof fallback === "number") {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  if (Array.isArray(fallback)) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.map(String).filter(Boolean).slice(0, MAX_ANNOUNCEMENTS)
        : fallback;
    } catch {
      // Legacy single-string value from before the switch to an array.
      return raw.trim() ? [raw.trim()] : fallback;
    }
  }
  return raw;
}

/** Serialize a typed value for storage in the settings table. */
export function serializeSetting(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((v) => String(v).trim()).filter(Boolean).slice(0, MAX_ANNOUNCEMENTS)
    );
  }
  return typeof value === "boolean" || typeof value === "number"
    ? String(value)
    : String(value);
}