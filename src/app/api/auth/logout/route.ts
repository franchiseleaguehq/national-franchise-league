import { NextResponse } from "next/server";

import { clearCommissionerSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  await clearCommissionerSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
