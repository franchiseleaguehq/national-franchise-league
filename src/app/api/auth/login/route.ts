import { NextResponse } from "next/server";

import { setCommissionerSession, verifyCommissionerPassword } from "@/lib/auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  if (!verifyCommissionerPassword(password)) {
    return NextResponse.redirect(new URL("/commissioner/login?error=1", request.url), { status: 303 });
  }

  await setCommissionerSession();
  return NextResponse.redirect(new URL("/commissioner", request.url), { status: 303 });
}
