import { NextResponse } from "next/server";

import { redirectUrl } from "@/lib/auth/redirect-url";
import { setCommissionerSession } from "@/lib/auth/session";
import { createCommissionerSetup, deleteDisposableCommissionerSetup } from "@/lib/db/commissioner-store";
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
    return NextResponse.redirect(redirectUrl(request, "/commissioner/setup?error=1"), { status: 303 });
  }

  let result: Awaited<ReturnType<typeof createCommissionerSetup>>;
  try {
    result = await createCommissionerSetup({
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
  } catch (error) {
    console.error("Commissioner setup failed", error);
    return NextResponse.redirect(redirectUrl(request, "/commissioner/setup?error=storage"), { status: 303 });
  }

  if (!result.ok) {
    return NextResponse.redirect(redirectUrl(request, "/commissioner/login"), { status: 303 });
  }

  await setCommissionerSession(result.setup.account.ownerId);
  return NextResponse.redirect(redirectUrl(request, "/commissioner"), { status: 303 });
}

export async function DELETE(request: Request) {
  const formData = await request.formData();
  const email = readString(formData, "email");
  const result = await deleteDisposableCommissionerSetup(email);

  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
