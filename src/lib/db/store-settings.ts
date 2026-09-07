import { db, schema } from "./index";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEYS,
  parseSetting,
  type StoreSettings,
} from "../settings";

export async function getStoreSettings(): Promise<StoreSettings> {
  const rows = await db.select().from(schema.settings);
  const stored = new Map(rows.map((r) => [r.key, r.value]));

  const settings = {} as StoreSettings;
  for (const key of SETTINGS_KEYS) {
    const raw = stored.get(key);
    (settings as unknown as Record<string, unknown>)[key] =
      raw !== undefined ? parseSetting(key, raw) : DEFAULT_SETTINGS[key];
  }
  return settings;
}