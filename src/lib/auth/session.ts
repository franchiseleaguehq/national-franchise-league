import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "nfl_commissioner_session";

function secret() {
  return process.env.COMMISSIONER_SESSION_SECRET ?? "local-development-session-secret-change-before-production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionValue(subject: string) {
  const payload = `${subject}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const received = parts[2];

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch {
    return false;
  }
}

export async function getCommissionerSession() {
  const store = await cookies();
  const value = store.get(cookieName)?.value;
  return verifySessionValue(value) ? value : null;
}

export async function setCommissionerSession(subject = "commissioner") {
  const store = await cookies();
  store.set(cookieName, createSessionValue(subject), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearCommissionerSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export function verifyCommissionerPassword(password: string) {
  const configured = process.env.COMMISSIONER_PASSWORD ?? "commissioner-demo-password";
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(configured));
  } catch {
    return false;
  }
}
