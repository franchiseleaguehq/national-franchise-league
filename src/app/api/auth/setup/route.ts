import { NextResponse } from "next/server";

import { setCommissionerSession } from "@/lib/auth/session";
import { createCommissionerSetup } from "@/lib/db/commissioner-store";
import type { OwnerRecord } from "@/lib/db/schema";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const confirmPassword = readString(formData, "confirmPassword");
  const displayName = readString(formData, "displayName");
  const gamertag = readString(formData, "gamertag");
  const avatarSrc = readString(formData, "avatarSrc");
  const bio = readString(formData, "bio");
  const timezone = readString(formData, "timezone");
  const youtubeUrl = readString(formData, "youtubeUrl");
  const twitchChannel = readString(formData, "twitchChannel");
  const kickUrl = readString(formData, "kickUrl");
  const preferredPlatform = readString(formData, "preferredPlatform") as OwnerRecord["preferredPlatform"];

  const allowedPlatforms: OwnerRecord["preferredPlatform"][] = ["YouTube", "Twitch", "Kick", "None"];

  if (!email || !password || !displayName || !gamertag || !bio || !timezone || password !== confirmPassword || password.length < 12 || !allowedPlatforms.includes(preferredPlatform) || !isValidUrl(avatarSrc) || !isValidUrl(youtubeUrl) || !isValidUrl(kickUrl)) {
    return NextResponse.redirect(new URL("/commissioner/setup?error=1", request.url), { status: 303 });
  }

  const result = await createCommissionerSetup({
    email,
    password,
    displayName,
    gamertag,
    avatarSrc,
    bio,
    timezone,
    youtubeUrl,
    twitchChannel,
    kickUrl,
    preferredPlatform,
  });

  if (!result.ok) {
    return NextResponse.redirect(new URL("/commissioner/login", request.url), { status: 303 });
  }

  await setCommissionerSession(result.setup.account.ownerId);
  return NextResponse.redirect(new URL("/commissioner", request.url), { status: 303 });
}
