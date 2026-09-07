export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  freeShippingThreshold: number;
  standardShippingUsd: number;
  expressShippingUsd: number;
  shippingEnabled: boolean;
  vatEnabled: boolean;
  taxRatePercent: number;
  announcement: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  name: "Hime",
  email: "hello@hime.jewellery",
  phone: "+971 50 000 0000",
  whatsapp: "+971 50 000 0000",
  instagram: "@hime.jewellery",
  freeShippingThreshold: 150,
  standardShippingUsd: 9,
  expressShippingUsd: 18,
  shippingEnabled: true,
  vatEnabled: true,
  taxRatePercent: 5,
  announcement: "Free Gulf-wide delivery on every order",
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof StoreSettings)[];

/** Deserialize a stored value from the settings table into the typed shape. */
export function parseSetting(key: keyof StoreSettings, raw: string): unknown {
  const fallback = DEFAULT_SETTINGS[key];
  if (typeof fallback === "boolean") return raw === "true";
  if (typeof fallback === "number") {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  return raw;
}

/** Serialize a typed value for storage in the settings table. */
export function serializeSetting(value: unknown): string {
  return typeof value === "boolean" || typeof value === "number"
    ? String(value)
    : String(value);
}