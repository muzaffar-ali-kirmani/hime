import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, schema } from "./db";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "hime-dev-secret-change-me-in-production-please-32chars"
);

const SESSION_COOKIE = "hime_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export interface SessionPayload {
  sub: string;
  email: string;
  sessionId: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, email: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  const token = await signSessionToken({ sub: userId, email, sessionId });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { sessionId, token };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (cookie) {
    try {
      const payload = await verifySessionToken(cookie.value);
      if (payload) {
        await db
          .delete(schema.sessions)
          .where(eq(schema.sessions.id, payload.sessionId));
      }
    } catch {}
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;

  const payload = await verifySessionToken(cookie.value);
  if (!payload) return null;

  const session = await db
    .select()
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.id, payload.sessionId),
        gt(schema.sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (session.length === 0) return null;

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.sub))
    .limit(1);

  if (user.length === 0) return null;
  return user[0];
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;