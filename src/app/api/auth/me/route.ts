export const runtime = "nodejs";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return apiSuccess({ user: null });
  return apiSuccess({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      country: user.country,
    },
  });
}