import { NextResponse } from "next/server";

import { setCommissionerSession } from "@/lib/auth/session";
import { verifyCommissionerCredentials } from "@/lib/db/commissioner-store";

const attempts = globalThis as typeof globalThis & {
  nflCommissionerLoginAttempts?: Record<string, { count: number; resetAt: number }>;
};

function rateLimitKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = rateLimitKey(request);
  if (!attempts.nflCommissionerLoginAttempts) attempts.nflCommissionerLoginAttempts = {};

  const current = attempts.nflCommissionerLoginAttempts[key];
  if (!current || now > current.resetAt) {
    attempts.nflCommissionerLoginAttempts[key] = { count: 1, resetAt: now + 15 * 60 * 1000 };
    return false;
  }

  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (isRateLimited(request)) {
    return NextResponse.redirect(new URL("/commissioner/login?error=1", request.url), { status: 303 });
  }

  const setup = await verifyCommissionerCredentials(email, password);
  if (!setup) {
    return NextResponse.redirect(new URL("/commissioner/login?error=1", request.url), { status: 303 });
  }

  await setCommissionerSession(setup.account.ownerId);
  return NextResponse.redirect(new URL("/commissioner", request.url), { status: 303 });
}
