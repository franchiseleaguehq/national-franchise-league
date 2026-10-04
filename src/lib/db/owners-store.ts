import "server-only";

import type { OwnerRecord } from "./schema";

const ownersKey = "nfl:owners";

const globalOwnerStore = globalThis as typeof globalThis & {
  nflOwnerRecords?: OwnerRecord[];
};

function durableStoreConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvCommand<T>(command: unknown[]) {
  const config = durableStoreConfig();
  if (!config) throw new Error("Owner storage is not configured.");

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
    throw new Error(`Owner storage request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

function rememberRuntime(owner: OwnerRecord) {
  if (!globalOwnerStore.nflOwnerRecords) {
    globalOwnerStore.nflOwnerRecords = [];
  }

  if (!globalOwnerStore.nflOwnerRecords.some((existing) => existing.id === owner.id)) {
    globalOwnerStore.nflOwnerRecords.unshift(owner);
  }
}

export async function saveOwnerRecord(owner: OwnerRecord) {
  rememberRuntime(owner);

  if (durableStoreConfig()) {
    try {
      await kvCommand<unknown>(["RPUSH", ownersKey, JSON.stringify(owner)]);
    } catch (error) {
      console.error("Failed to persist owner record to durable storage.", error);
    }
  }

  return owner;
}

export function listRuntimeOwners() {
  return globalOwnerStore.nflOwnerRecords ?? [];
}

export async function listStoredOwners(): Promise<OwnerRecord[]> {
  if (!durableStoreConfig()) return [];

  try {
    const raw = await kvCommand<string[]>(["LRANGE", ownersKey, "0", "-1"]);
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [raw];
    return items
      .map((entry) => {
        try {
          return JSON.parse(typeof entry === "string" ? entry : JSON.stringify(entry)) as OwnerRecord;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is OwnerRecord => entry !== null && typeof entry.id === "string");
  } catch (error) {
    console.error("Failed to read owner records from durable storage.", error);
    return [];
  }
}
