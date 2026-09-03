import { destroySession } from "@/lib/auth";
import { apiSuccess } from "@/lib/api";

export async function POST() {
  await destroySession();
  return apiSuccess({ success: true });
}