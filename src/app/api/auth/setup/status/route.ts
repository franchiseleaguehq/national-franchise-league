import { NextResponse } from "next/server";

import { commissionerAccountExists, commissionerStoreStatus } from "@/lib/db/commissioner-store";

export async function GET() {
  const store = commissionerStoreStatus();
  const exists = await commissionerAccountExists();

  return NextResponse.json({
    accountExists: exists,
    durableStoreConfigured: store.durable,
    production: store.production,
  });
}
