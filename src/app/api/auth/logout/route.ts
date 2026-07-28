import { NextResponse } from "next/server";

import { redirectUrl } from "@/lib/auth/redirect-url";
import { clearCommissionerSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  await clearCommissionerSession();
  return NextResponse.redirect(redirectUrl(request, "/"), { status: 303 });
}
