import { NextResponse } from "next/server";
import { AuthError } from "./auth";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function handleApiError(err: unknown) {
  if (err instanceof AuthError) {
    return apiError(err.message, err.status);
  }
  if (err instanceof ZodError) {
    return apiError("Validation failed", 422, err.issues);
  }
  console.error("[api error]", err);
  return apiError("Internal server error", 500);
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function generateOrderNumber() {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HM-${yy}${mm}${dd}-${random}`;
}