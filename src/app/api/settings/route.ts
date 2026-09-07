export const runtime = "nodejs";
// Settings change from the admin dashboard at any time — never cache this.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { apiSuccess, handleApiError } from "@/lib/api";
import { getStoreSettings } from "@/lib/db/store-settings";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return apiSuccess({ settings });
  } catch (err) {
    return handleApiError(err);
  }
}
