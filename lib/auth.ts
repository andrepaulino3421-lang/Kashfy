import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import type { Session } from "@/lib/types";

const COOKIE_NAME = "kashfy_session";
const MAX_AGE_DAYS = 30;

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function sign(payload: string, secret: string) {
  return base64url(crypto.createHmac("sha256", secret).update(payload).digest());
}

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET não configurado");
  return s;
}

export function createSessionCookie(userId: string) {
  const exp = Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ userId, exp });
  const payloadB64 = base64url(payload);
  const sig = sign(payloadB64, getSecret());
  const token = `${payloadB64}.${sig}`;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export function getSession(): Session | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = sign(payloadB64, getSecret());
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  const json = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  const data = JSON.parse(json) as { userId: string; exp: number };

  if (!data?.userId || !data?.exp) return null;
  if (Date.now() > data.exp) return null;
  return { userId: data.userId };
}

export function requireSession() {
  const s = getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

export async function getUserWithSubscription(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
  });
}
