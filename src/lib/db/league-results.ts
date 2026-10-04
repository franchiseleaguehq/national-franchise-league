import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * League results synced from the Madden Companion App export pipeline.
 *
 * The poller on Pax's VM converts each export into `data/league-results.json`
 * (committed to the repo, deployed by Vercel). This reader loads it at
 * request time. When no export has landed yet it returns null and the site
 * keeps showing its "awaiting results" state.
 */

export type SyncedStanding = {
  team: string; // e.g. "Giants"
  abbr: string; // e.g. "NYG"
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
};

export type SyncedGame = {
  week: string; // e.g. "Week 1"
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeOwner?: string;
  awayOwner?: string;
  recap?: string; // Johnny-style GroupMe recap
};

export type LeagueResults = {
  updatedAt: string; // ISO timestamp
  season: string; // e.g. "Season 1"
  week: string; // current/most recent week label
  standings: SyncedStanding[];
  recentGames: SyncedGame[];
};

let cache: LeagueResults | null | undefined;

export function getLeagueResults(): LeagueResults | null {
  if (cache !== undefined) return cache;
  try {
    const raw = readFileSync(join(process.cwd(), "data", "league-results.json"), "utf-8");
    const parsed = JSON.parse(raw) as LeagueResults;
    if (!parsed || !Array.isArray(parsed.standings) || parsed.standings.length === 0) {
      cache = null;
      return cache;
    }
    cache = parsed;
    return cache;
  } catch {
    cache = null;
    return cache;
  }
}

/** True once the first real Madden export has been synced. */
export function hasLeagueResults(): boolean {
  return getLeagueResults() !== null;
}
