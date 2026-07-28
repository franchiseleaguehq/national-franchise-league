export type ID = string;

export type OwnerLeagueStatus = "active" | "commissioner" | "open" | "inactive" | "former" | "suspended" | "banned";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "pending_commissioner_review"
  | "more_information_requested"
  | "approved"
  | "approved_awaiting_team_assignment"
  | "rejected"
  | "withdrawn";

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
  slug: string;
  leagueId: ID;
  name: string;
  gamertag: string;
  role: "commissioner" | "committee" | "owner";
  status: OwnerLeagueStatus;
  teamId?: ID;
  teamSelectionStatus?: "awaiting_lottery" | "in_lottery" | "team_selected" | "passed" | "removed";
  pastTeamIds: ID[];
  discordHandle: string;
  bio: string;
  timezone: string;
  avatarSrc?: string;
  preferredPlatform: "YouTube" | "Twitch" | "None";
  twitchChannel?: string;
  youtubeUrl?: string;
  seasonsPlayed: number;
  careerRecord: string;
  playoffRecord: string;
  divisionTitles: number;
  conferenceChampionships: number;
  superBowlChampionships: number;
  currentWinStreak: number;
  gamesStreamed: number;
  ownerSince: string;
  awards: string[];
  achievementIds: ID[];
  hallOfFame: boolean;
  accessSuspended: boolean;
  commissionerNotes?: string;
  joinedAt: string;
};

export type TeamRecord = {
  id: ID;
  slug: string;
  leagueId: ID;
  ownerId?: ID;
  city: string;
  name: string;
  fullName: string;
  abbreviation: string;
  logoSrc: string;
  primaryColor: string;
  secondaryColor: string;
  isOpen: boolean;
};

export type OwnerAchievementRecord = {
  id: ID;
  label:
    | "Founding Member"
    | "Commissioner"
    | "League Veteran"
    | "Reliable Owner"
    | "Broadcaster"
    | "Good Sportsmanship"
    | "Division Champion"
    | "Conference Champion"
    | "Super Bowl Champion"
    | "Ironman"
    | "Dynasty"
    | "Hall of Fame";
  description: string;
};

export type ApplicationRecord = {
  id: ID;
  leagueId: ID;
  fullName: string;
  preferredDisplayName: string;
  gamertag: string;
  email: string;
  phone?: string;
  timezone: string;
  preferredTeamId?: ID;
  teamPreferenceNotes: string;
  backupTeamChoices: string;
  maddenLeagueExperience: string;
  availability: string;
  youtubeUrl?: string;
  twitchChannel?: string;
  preferredPlatform: "YouTube" | "Twitch" | "None";
  whyJoin: string;
  readOrientation: boolean;
  agreeRulebook: boolean;
  status: ApplicationStatus;
  assignedTeamId?: ID;
  reviewerNote?: string;
  submittedAt: string;
};

export type OwnerMembershipRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  status: OwnerLeagueStatus;
  activeTeamId?: ID;
  accessLevel: "owner" | "commissioner" | "none";
  activatedAt?: string;
  endedAt?: string;
};

export type OwnerTeamAssignmentRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  teamId: ID;
  season: number;
  startedAt: string;
  endedAt?: string;
  status: "current" | "released" | "former";
};

export type TeamLotteryEntryStatus = "waiting" | "on_the_clock" | "team_selected" | "passed" | "removed";

export type TeamLotteryEntryRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  season: number;
  pickNumber: number;
  status: TeamLotteryEntryStatus;
  lockedAt?: string;
};

export type TeamLotterySelectionRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  teamId: ID;
  season: number;
  pickNumber: number;
  selectedAt: string;
};

export type OwnerSeasonHistoryRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  season: number;
  teamId?: ID;
  record: string;
  playoffRecord: string;
  notes: string;
};

export type CommissionerAccountRecord = {
  id: ID;
  leagueId: ID;
  ownerId: ID;
  email: string;
  passwordHash: string;
  role: "commissioner";
  createdAt: string;
};

export type CommissionerSetupRecord = {
  account: CommissionerAccountRecord;
  owner: OwnerRecord;
};

export type GameRecord = {
  id: ID;
  leagueId: ID;
  week: number;
  awayTeamId: ID;
  homeTeamId: ID;
  awayScore?: number;
  homeScore?: number;
  status: "unscheduled" | "scheduled" | "live" | "final" | "force_win" | "sim";
  kickoffAt: string;
  nflScheduleLabel?: string;
  kickoffTime?: string;
  network?: string;
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
  ownerAchievements: OwnerAchievementRecord[];
  applications: ApplicationRecord[];
  ownerMemberships: OwnerMembershipRecord[];
  ownerTeamAssignments: OwnerTeamAssignmentRecord[];
  ownerSeasonHistory: OwnerSeasonHistoryRecord[];
  teamLotteryEntries: TeamLotteryEntryRecord[];
  teamLotterySelections: TeamLotterySelectionRecord[];
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
