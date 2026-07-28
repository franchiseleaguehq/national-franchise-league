import "server-only";

import { readFileSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import type { CommissionerSetupRecord, OwnerRecord } from "./schema";

const leagueId = "league_nfl";
const accountPath = path.join(process.cwd(), ".data", "commissioner-account.json");

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
  kickUrl?: string;
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
  try {
    const raw = await readFile(accountPath, "utf8");
    return JSON.parse(raw) as CommissionerSetupRecord;
  } catch {
    return null;
  }
}

export async function getCommissionerSetup() {
  return readSetupFile();
}

export function getCommissionerSetupSync() {
  try {
    const raw = readFileSync(accountPath, "utf8");
    return JSON.parse(raw) as CommissionerSetupRecord;
  } catch {
    return null;
  }
}

export async function commissionerAccountExists() {
  return Boolean(await readSetupFile());
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
    kickUrl: input.kickUrl?.trim() || undefined,
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

  await mkdir(path.dirname(accountPath), { recursive: true });
  await writeFile(accountPath, JSON.stringify(setup, null, 2), { flag: "wx", mode: 0o600 });

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
