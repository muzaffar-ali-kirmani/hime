export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { getStoreSettings } from "@/lib/db/store-settings";
import { DEFAULT_SETTINGS, SETTINGS_KEYS, serializeSetting } from "@/lib/settings";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

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