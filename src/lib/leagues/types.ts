export type MaddenPlatform = "PS5" | "Xbox Series X|S" | "PC";

export type LeagueSocialLinks = {
  discord?: string;
  twitchChannel?: string;
  youtubeChannel?: string;
  instagram?: string;
};

export type LeagueTeam = {
  id: string;
  city: string;
  name: string;
  fullName: string;
  logoSrc?: string;
  owner?: string;
};

export type LeagueStanding = {
  teamId: string;
  wins: number;
  losses: number;
  pointDiff: number;
};

export type LeagueScheduleGame = {
  id: string;
  week: number;
  startsAt: string;
  awayTeamId: string;
  homeTeamId: string;
  streamUrl?: string;
};

export type LeagueStatLeader = {
  category: string;
  player: string;
  teamId: string;
  stat: string;
  extra?: string;
};

export type MaddenLeague = {
  id: string;
  slug: string;
  name: string;
  logoSrc: string;
  commissioner: string;
  platform: MaddenPlatform;
  season: number;
  week: number;
  socials: LeagueSocialLinks;
  rulesPath: string;
  teams: LeagueTeam[];
  standings: LeagueStanding[];
  schedule: LeagueScheduleGame[];
  leaders: LeagueStatLeader[];
  powerRankings: Array<{ teamId: string; rank: number; note: string }>;
  news: Array<{ label: string; headline: string }>;
  hallOfFame: Array<{ title: string; note: string }>;
};
