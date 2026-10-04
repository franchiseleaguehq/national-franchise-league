import "server-only";

import type { ApplicationRecord } from "./schema";

const applicationsKey = "nfl:applications";
const applicationDecisionsKey = "nfl:application_decisions";

export type ApplicationDecision = {
  status: "approved" | "rejected";
  decidedAt: string;
  decidedBy: string;
};

const globalApplications = globalThis as typeof globalThis & {
  nflOwnerApplications?: ApplicationRecord[];
};

function durableStoreConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvCommand<T>(command: unknown[]) {
  const config = durableStoreConfig();
  if (!config) throw new Error("Application storage is not configured.");

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
    throw new Error(`Application storage request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

function rememberRuntime(application: ApplicationRecord) {
  if (!globalApplications.nflOwnerApplications) {
    globalApplications.nflOwnerApplications = [];
  }

  if (!globalApplications.nflOwnerApplications.some((existing) => existing.id === application.id)) {
    globalApplications.nflOwnerApplications.unshift(application);
  }
}

export async function saveOwnerApplication(application: ApplicationRecord) {
  rememberRuntime(application);

  if (durableStoreConfig()) {
    try {
      await kvCommand<unknown>(["RPUSH", applicationsKey, JSON.stringify(application)]);
    } catch (error) {
      console.error("Failed to persist owner application to durable storage.", error);
    }
  }

  return application;
}

export function listRuntimeApplications() {
  return globalApplications.nflOwnerApplications ?? [];
}

export async function listStoredApplications(): Promise<ApplicationRecord[]> {
  if (!durableStoreConfig()) return [];

  try {
    const raw = await kvCommand<string[]>(["LRANGE", applicationsKey, "0", "-1"]);
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [raw];
    const decisions = await listApplicationDecisions();
    return items
      .map((entry) => {
        try {
          const record = JSON.parse(typeof entry === "string" ? entry : JSON.stringify(entry)) as ApplicationRecord;
          const decision = decisions[record.id];
          return decision ? { ...record, status: decision.status } : record;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is ApplicationRecord => entry !== null && typeof entry.id === "string");
  } catch (error) {
    console.error("Failed to read owner applications from durable storage.", error);
    return [];
  }
}

export async function recordApplicationDecision(id: string, status: ApplicationDecision["status"], decidedBy: string) {
  const decision: ApplicationDecision = { status, decidedAt: new Date().toISOString(), decidedBy };

  const runtime = listRuntimeApplications().find((application) => application.id === id);
  if (runtime) runtime.status = status;

  if (durableStoreConfig()) {
    try {
      await kvCommand<unknown>(["HSET", applicationDecisionsKey, id, JSON.stringify(decision)]);
    } catch (error) {
      console.error("Failed to persist application decision to durable storage.", error);
      throw error;
    }
  }

  return decision;
}

export async function listApplicationDecisions(): Promise<Record<string, ApplicationDecision>> {
  if (!durableStoreConfig()) return {};

  try {
    const raw = await kvCommand<Record<string, string>>(["HGETALL", applicationDecisionsKey]);
    if (!raw || typeof raw !== "object") return {};
    const decisions: Record<string, ApplicationDecision> = {};
    for (const [id, value] of Object.entries(raw)) {
      try {
        const parsed = JSON.parse(value) as ApplicationDecision;
        if (parsed && (parsed.status === "approved" || parsed.status === "rejected")) {
          decisions[id] = parsed;
        }
      } catch {
        // ignore malformed entries
      }
    }
    return decisions;
  } catch (error) {
    console.error("Failed to read application decisions from durable storage.", error);
    return {};
  }
}
