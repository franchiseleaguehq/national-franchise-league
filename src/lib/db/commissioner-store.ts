import "server-only";

import { readFileSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import type { CommissionerSetupRecord, OwnerRecord } from "./schema";

const leagueId = "league_nfl";
const accountPath = path.join(process.cwd(), ".data", "commissioner-account.json");
const accountKey = "nfl:commissioner-account";
const globalStore = globalThis as typeof globalThis & {
  nflCommissionerSetupCache?: CommissionerSetupRecord | null;
};

type SetupInput = {
  email: string;
  password: string;
  displayName: string;
  gamertag: string;
  avatarSrc?: string;
  bio: string;
  timezone: string;
  youtubeUrl?: string;
  twitchChannel?: string;
  preferredPlatform: OwnerRecord["preferredPlatform"];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "commissioner-owner";
}

async function readSetupFile() {
  const durable = durableStoreConfig();
  if (durable) {
    const setup = await kvCommand<CommissionerSetupRecord | string | null>(["GET", accountKey]);
    const parsed = typeof setup === "string" ? (JSON.parse(setup) as CommissionerSetupRecord) : setup;
    globalStore.nflCommissionerSetupCache = parsed;
    return parsed;
  }

  if (isProduction()) {
    globalStore.nflCommissionerSetupCache = null;
    return null;
  }

  try {
    const raw = await readFile(accountPath, "utf8");
    const setup = JSON.parse(raw) as CommissionerSetupRecord;
    globalStore.nflCommissionerSetupCache = setup;
    return setup;
  } catch {
    globalStore.nflCommissionerSetupCache = null;
    return null;
  }
}

function isProduction() {
  return process.env.VERCEL_ENV === "production";
}

function durableStoreConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvCommand<T>(command: unknown[]) {
  const config = durableStoreConfig();
  if (!config) throw new Error("Commissioner account storage is not configured.");

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Commissioner account storage request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

export async function getCommissionerSetup() {
  return readSetupFile();
}

export function getCommissionerSetupSync() {
  if (globalStore.nflCommissionerSetupCache !== undefined) {
    return globalStore.nflCommissionerSetupCache;
  }

  if (durableStoreConfig() || isProduction()) {
    return null;
  }

  try {
    const raw = readFileSync(accountPath, "utf8");
    const setup = JSON.parse(raw) as CommissionerSetupRecord;
    globalStore.nflCommissionerSetupCache = setup;
    return setup;
  } catch {
    globalStore.nflCommissionerSetupCache = null;
    return null;
  }
}

export async function commissionerAccountExists() {
  return Boolean(await readSetupFile());
}

export function commissionerStoreStatus() {
  return {
    durable: Boolean(durableStoreConfig()),
    production: isProduction(),
  };
}

export async function createCommissionerSetup(input: SetupInput) {
  if (await commissionerAccountExists()) {
    return { ok: false as const, reason: "exists" };
  }

  const createdAt = new Date().toISOString();
  const ownerId = `owner_${randomUUID()}`;
  const owner: OwnerRecord = {
    id: ownerId,
    slug: slugify(input.displayName),
    leagueId,
    name: input.displayName.trim(),
    gamertag: input.gamertag.trim(),
    role: "commissioner",
    status: "commissioner",
    teamSelectionStatus: "awaiting_lottery",
    pastTeamIds: [],
    discordHandle: "",
    bio: input.bio.trim(),
    timezone: input.timezone.trim(),
    avatarSrc: input.avatarSrc?.trim() || undefined,
    preferredPlatform: input.preferredPlatform,
    twitchChannel: input.twitchChannel?.trim() || undefined,
    youtubeUrl: input.youtubeUrl?.trim() || undefined,
    seasonsPlayed: 0,
    careerRecord: "0-0",
    playoffRecord: "0-0",
    divisionTitles: 0,
    conferenceChampionships: 0,
    superBowlChampionships: 0,
    currentWinStreak: 0,
    gamesStreamed: 0,
    ownerSince: new Date(createdAt).getFullYear().toString(),
    awards: [],
    achievementIds: [],
    hallOfFame: false,
    accessSuspended: false,
    joinedAt: createdAt,
  };

  const setup: CommissionerSetupRecord = {
    account: {
      id: `commissioner_${randomUUID()}`,
      leagueId,
      ownerId,
      email: normalizeEmail(input.email),
      passwordHash: await bcrypt.hash(input.password, 12),
      role: "commissioner",
      createdAt,
    },
    owner,
  };

  if (durableStoreConfig()) {
    const result = await kvCommand<string | null>(["SET", accountKey, JSON.stringify(setup), "NX"]);
    if (result !== "OK") return { ok: false as const, reason: "exists" };
  } else {
    if (isProduction()) throw new Error("Commissioner account storage is not configured for production.");
    await mkdir(path.dirname(accountPath), { recursive: true });
    await writeFile(accountPath, JSON.stringify(setup, null, 2), { flag: "wx", mode: 0o600 });
  }

  globalStore.nflCommissionerSetupCache = setup;

  return { ok: true as const, setup };
}

export async function verifyCommissionerCredentials(email: string, password: string) {
  const setup = await readSetupFile();
  if (!setup) return null;

  const emailMatches = normalizeEmail(email) === setup.account.email;
  const passwordMatches = await bcrypt.compare(password, setup.account.passwordHash);
  if (!emailMatches || !passwordMatches) return null;

  return setup;
}

export async function deleteDisposableCommissionerSetup(email: string) {
  const setup = await readSetupFile();
  if (!setup) return { ok: true as const, deleted: false };
  if (setup.account.email !== normalizeEmail(email) || !setup.account.email.endsWith("@example.com")) {
    return { ok: false as const, reason: "not_disposable" };
  }

  if (durableStoreConfig()) {
    await kvCommand<number>(["DEL", accountKey]);
  } else if (!isProduction()) {
    await import("fs/promises").then(({ rm }) => rm(accountPath, { force: true }));
  }

  globalStore.nflCommissionerSetupCache = null;
  return { ok: true as const, deleted: true };
}
