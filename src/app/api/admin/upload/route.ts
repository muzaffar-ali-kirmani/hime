export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const BUCKET = "product-images";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return apiError("No file provided. Send a file field named 'file'.", 400);
    }

    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return apiError(
        "Unsupported image type. Use JPEG, PNG, WebP, GIF or SVG.",
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError("Image must be 5MB or smaller.", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}${ext}`;

    const supabase = supabaseAdmin();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      return apiError(`Storage upload failed: ${error.message}`, 500);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return apiSuccess({ url: data.publicUrl }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
