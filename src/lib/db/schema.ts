export type ID = string;

export type LeagueRecord = {
  id: ID;
  slug: string;
  name: string;
  logoSrc: string;
  description: string;
  platform: "PS5" | "Xbox Series X|S" | "PC";
  season: number;
  week: number;
  commissionerId: ID;
  discordUrl: string;
  twitchChannel: string;
  youtubeChannelUrl: string;
  instagramUrl: string;
};

export type OwnerRecord = {
  id: ID;
  leagueId: ID;
  name: string;
  gamertag: string;
  role: "commissioner" | "committee" | "owner";
  teamId?: ID;
  discordHandle: string;
  twitchChannel?: string;
  youtubeUrl?: string;
  joinedAt: string;
};

export type TeamRecord = {
  id: ID;
  leagueId: ID;
  ownerId?: ID;
  city: string;
  name: string;
  fullName: string;
  abbreviation: string;
  logoSrc: string;
  primaryColor: string;
  secondaryColor: string;
};

export type GameRecord = {
  id: ID;
  leagueId: ID;
  week: number;
  awayTeamId: ID;
  homeTeamId: ID;
  awayScore?: number;
  homeScore?: number;
  status: "scheduled" | "live" | "final";
  kickoffAt: string;
  streamUrl?: string;
  isGameOfTheWeek?: boolean;
};

export type StandingRecord = {
  id: ID;
  leagueId: ID;
  teamId: ID;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
};

export type TradeRecord = {
  id: ID;
  leagueId: ID;
  fromTeamId: ID;
  toTeamId: ID;
  summary: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
};

export type AnnouncementRecord = {
  id: ID;
  leagueId: ID;
  title: string;
  body: string;
  createdAt: string;
};

export type LeagueRuleRecord = {
  id: ID;
  leagueId: ID;
  title: string;
  body: string[];
  order: number;
};

export type HallOfFameRecord = {
  id: ID;
  leagueId: ID;
  category: string;
  title: string;
  description: string;
  season?: number;
};

export type AwardRecord = {
  id: ID;
  leagueId: ID;
  season: number;
  week?: number;
  title: string;
  winner: string;
  teamId?: ID;
};

export type StatRecord = {
  id: ID;
  leagueId: ID;
  teamId: ID;
  playerName: string;
  category: "Passing" | "Rushing" | "Receiving" | "Sacks" | "INTs" | "Tackles" | "Def TD";
  value: string;
  extra?: string;
};

export type PowerRankingRecord = {
  id: ID;
  leagueId: ID;
  teamId: ID;
  rank: number;
  note: string;
};

export type TransactionRecord = {
  id: ID;
  leagueId: ID;
  teamId: ID;
  description: string;
  createdAt: string;
};

export type DatabaseSnapshot = {
  leagues: LeagueRecord[];
  owners: OwnerRecord[];
  teams: TeamRecord[];
  games: GameRecord[];
  standings: StandingRecord[];
  trades: TradeRecord[];
  announcements: AnnouncementRecord[];
  rules: LeagueRuleRecord[];
  hallOfFame: HallOfFameRecord[];
  awards: AwardRecord[];
  stats: StatRecord[];
  powerRankings: PowerRankingRecord[];
  transactions: TransactionRecord[];
};
