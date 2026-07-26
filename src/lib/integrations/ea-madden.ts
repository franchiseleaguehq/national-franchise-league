import type { LeagueScheduleGame, LeagueStanding, LeagueStatLeader, LeagueTeam } from "@/lib/leagues/types";

export type EaMaddenSyncPayload = {
  leagueId: string;
  exportedAt: string;
  teams: LeagueTeam[];
  standings: LeagueStanding[];
  schedule: LeagueScheduleGame[];
  leaders: LeagueStatLeader[];
  transactions: Array<{ id: string; teamId: string; description: string; createdAt: string }>;
};

export interface EaMaddenDataProvider {
  getLeagueExport(leagueId: string): Promise<EaMaddenSyncPayload>;
  syncRosters(leagueId: string): Promise<LeagueTeam[]>;
  syncStandings(leagueId: string): Promise<LeagueStanding[]>;
  syncSchedule(leagueId: string): Promise<LeagueScheduleGame[]>;
  syncPlayerStats(leagueId: string): Promise<LeagueStatLeader[]>;
}

export class MockEaMaddenDataProvider implements EaMaddenDataProvider {
  async getLeagueExport(leagueId: string): Promise<EaMaddenSyncPayload> {
    return {
      leagueId,
      exportedAt: new Date(0).toISOString(),
      teams: [],
      standings: [],
      schedule: [],
      leaders: [],
      transactions: [],
    };
  }

  async syncRosters(): Promise<LeagueTeam[]> {
    return [];
  }

  async syncStandings(): Promise<LeagueStanding[]> {
    return [];
  }

  async syncSchedule(): Promise<LeagueScheduleGame[]> {
    return [];
  }

  async syncPlayerStats(): Promise<LeagueStatLeader[]> {
    return [];
  }
}
