import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "nfl_commissioner_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

function secret() {
  return process.env.COMMISSIONER_SESSION_SECRET ?? "local-development-session-secret-change-before-production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionValue(subject: string) {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = `${subject}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const received = parts[2];

  try {
    const isValid = timingSafeEqual(Buffer.from(expected), Buffer.from(received));
    const expiresAt = Number(parts[1]);
    if (!isValid || Number.isNaN(expiresAt) || Date.now() > expiresAt) return null;
    return { ownerId: parts[0], expiresAt };
  } catch {
    return null;
  }
}

export async function getCommissionerSession() {
  const store = await cookies();
  const value = store.get(cookieName)?.value;
  return verifySessionValue(value);
}

export async function setCommissionerSession(subject: string) {
  const store = await cookies();
  store.set(cookieName, createSessionValue(subject), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.VERCEL_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function clearCommissionerSession() {
  const store = await cookies();
  store.delete(cookieName);
}
