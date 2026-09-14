export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { getStoreSettings } from "@/lib/db/store-settings";
import { DEFAULT_SETTINGS, SETTINGS_KEYS, serializeSetting, MAX_ANNOUNCEMENTS } from "@/lib/settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getStoreSettings();
    return apiSuccess({ settings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    if (typeof body !== "object" || body === null) {
      return apiError("Invalid settings payload", 400);
    }

    const updates: { key: string; value: string }[] = [];
    for (const key of SETTINGS_KEYS) {
      if (key in body) {
        let value = body[key];
        // Coerce to the expected type for safety.
        if (typeof DEFAULT_SETTINGS[key] === "number") {
          const n = typeof value === "number" ? value : parseFloat(value);
          if (!Number.isFinite(n)) return apiError(`${key} must be a number`, 400);
          value = n;
        } else if (typeof DEFAULT_SETTINGS[key] === "boolean") {
          value = Boolean(value);
        } else if (Array.isArray(DEFAULT_SETTINGS[key])) {
          if (!Array.isArray(value)) return apiError(`${key} must be an array`, 400);
          value = value
            .map((v: unknown) => String(v ?? "").trim())
            .filter(Boolean)
            .slice(0, MAX_ANNOUNCEMENTS);
        } else {
          value = String(value ?? "");
        }
        updates.push({ key, value: serializeSetting(value) });
      }
    }

    if (updates.length === 0) {
      return apiError("No valid settings provided", 400);
    }

    for (const u of updates) {
      await db
        .insert(schema.settings)
        .values({ key: u.key, value: u.value })
        .onConflictDoUpdate({
          target: schema.settings.key,
          set: { value: u.value, updatedAt: new Date() },
        });
    }

    const settings = await getStoreSettings();
    return apiSuccess({ settings });
  } catch (err) {
    return handleApiError(err);
  }
}