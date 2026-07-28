import { db } from "./seed";
import { listRuntimeApplications } from "./applications";
import { getCommissionerSetupSync } from "./commissioner-store";
import type { ApplicationStatus, OwnerLeagueStatus, OwnerRecord, TeamRecord } from "./schema";

const leagueId = "league_nfl";
const unassignedTeam: TeamRecord = {
  id: "unassigned",
  slug: "unassigned-owner",
  leagueId,
  city: "National Franchise League",
  name: "Unassigned",
  fullName: "Unassigned Owner",
  abbreviation: "NFL",
  logoSrc: "/league-logo.png",
  primaryColor: "#00A3FF",
  secondaryColor: "#BFC7D5",
  isOpen: false,
};

function teamName(teamId: string) {
  return db.teams.find((team) => team.id === teamId)?.fullName ?? "Unknown Team";
}

function teamRecord(teamId: string) {
  const standing = db.standings.find((row) => row.teamId === teamId);
  return standing ? `${standing.wins}-${standing.losses}` : "0-0";
}

function setupOwner() {
  return getCommissionerSetupSync()?.owner;
}

function leagueOwners() {
  const owner = setupOwner();
  return owner ? [owner, ...db.owners] : db.owners;
}

function leagueTeams() {
  const owner = setupOwner();
  const selectedTeams = db.teamLotterySelections.reduce<Record<string, string>>((acc, selection) => {
    acc[selection.teamId] = selection.ownerId;
    return acc;
  }, {});

  return db.teams.map((team) => {
    const selectedOwnerId = selectedTeams[team.id];
    if (selectedOwnerId) return { ...team, ownerId: selectedOwnerId, isOpen: false };
    if (!owner?.teamId || team.id !== owner.teamId) return team;
    return { ...team, ownerId: owner.id, isOpen: false };
  });
}

function leagueMemberships() {
  const owner = setupOwner();
  if (!owner) return db.ownerMemberships;

  return [
    {
      id: `membership_${owner.id}`,
      leagueId,
      ownerId: owner.id,
      status: owner.status,
      activeTeamId: owner.teamId,
      accessLevel: "commissioner" as const,
      activatedAt: owner.joinedAt,
    },
    ...db.ownerMemberships,
  ];
}

function leagueAssignments() {
  const owner = setupOwner();
  if (!owner?.teamId) return db.ownerTeamAssignments;

  return [
    {
      id: `assignment_${owner.id}_${owner.teamId}`,
      leagueId,
      ownerId: owner.id,
      teamId: owner.teamId,
      season: getLeague().season,
      startedAt: owner.joinedAt,
      status: "current" as const,
    },
    ...db.ownerTeamAssignments,
  ];
}

export function getLeague() {
  const league = db.leagues.find((item) => item.id === leagueId);
  if (!league) throw new Error("League seed missing");
  return league;
}

export function getHomeData() {
  const league = getLeague();
  const standings = db.standings
    .filter((row) => row.leagueId === league.id)
    .sort((a, b) => b.wins - a.wins || a.losses - b.losses)
    .map((row, index) => [String(index + 1), teamName(row.teamId), `${row.wins}-${row.losses}`, `${row.pointsFor - row.pointsAgainst >= 0 ? "+" : ""}${row.pointsFor - row.pointsAgainst}`]);

  const leaders = db.stats
    .filter((stat) => stat.leagueId === league.id)
    .map((stat) => [stat.category, stat.playerName, teamName(stat.teamId), stat.value, stat.extra ?? ""]);

  const games = db.games.filter((game) => game.leagueId === league.id);
  const gameOfTheWeek = games.find((game) => game.isGameOfTheWeek) ?? games[0];

  return {
    league,
    teams: leagueTeams().filter((team) => team.leagueId === league.id),
    owners: leagueOwners().filter((owner) => owner.leagueId === league.id),
    standings,
    leaders,
    schedule: games.map((game) => [
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(game.kickoffAt)),
      teamName(game.homeTeamId),
      teamName(game.awayTeamId),
      new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(game.kickoffAt)),
    ]),
    scores: games
      .filter((game) => game.status === "final")
      .map((game) => [teamName(game.awayTeamId), teamName(game.homeTeamId), String(game.awayScore ?? 0), String(game.homeScore ?? 0), "Final"]),
    gameOfTheWeek,
    rankings: db.powerRankings
      .filter((row) => row.leagueId === league.id)
      .sort((a, b) => a.rank - b.rank)
      .map((row) => [String(row.rank), teamName(row.teamId), row.note]),
    newsItems: db.announcements.filter((item) => item.leagueId === league.id).map((item) => [item.title, item.body]),
    commissionerHub: [
      ...db.announcements.filter((item) => item.leagueId === league.id).map((item) => [item.title, item.body]),
      ...db.trades.filter((trade) => trade.leagueId === league.id).map((trade) => ["Trade approvals", trade.summary]),
    ],
    transactions: db.transactions.filter((tx) => tx.leagueId === league.id).map((tx) => [teamName(tx.teamId), tx.description]),
    hallOfFame: db.hallOfFame.filter((item) => item.leagueId === league.id),
    teamRecord,
  };
}

export function getCommissionerDashboardData() {
  const league = getLeague();
  const applications = [...listRuntimeApplications(), ...db.applications.filter((application) => application.leagueId === league.id)];
  return {
    league,
    pendingTrades: db.trades.filter((trade) => trade.leagueId === league.id && trade.status === "pending"),
    announcements: db.announcements.filter((item) => item.leagueId === league.id),
    owners: leagueOwners().filter((owner) => owner.leagueId === league.id),
    teams: leagueTeams().filter((team) => team.leagueId === league.id),
    applications,
    achievements: db.ownerAchievements,
    memberships: leagueMemberships().filter((membership) => membership.leagueId === league.id),
    assignments: leagueAssignments().filter((assignment) => assignment.leagueId === league.id),
    ownerSeasonHistory: db.ownerSeasonHistory.filter((history) => history.leagueId === league.id),
    games: db.games.filter((game) => game.leagueId === league.id),
    rules: db.rules.filter((rule) => rule.leagueId === league.id).sort((a, b) => a.order - b.order),
  };
}

export function getOwnerProfile(ownerId: string) {
  const owner = leagueOwners().find((item) => item.id === ownerId || item.slug === ownerId);
  if (!owner) return null;
  return {
    owner,
    team: owner.teamId ? leagueTeams().find((team) => team.id === owner.teamId) : undefined,
    pastTeams: owner.pastTeamIds.map((teamId) => leagueTeams().find((team) => team.id === teamId)).filter(Boolean),
    assignments: leagueAssignments().filter((assignment) => assignment.ownerId === owner.id),
    seasonHistory: db.ownerSeasonHistory.filter((history) => history.ownerId === owner.id),
    games: db.games.filter((game) => game.homeTeamId === owner.teamId || game.awayTeamId === owner.teamId),
    achievements: db.ownerAchievements.filter((achievement) => owner.achievementIds.includes(achievement.id)),
  };
}

export function getOwnerDirectory() {
  const league = getLeague();
  const owners = leagueOwners().filter((owner) => owner.leagueId === league.id);

  return leagueTeams()
    .filter((team) => team.leagueId === league.id)
    .map((team) => {
      const owner = team.ownerId ? owners.find((item) => item.id === team.ownerId) : undefined;
      const achievements = owner ? db.ownerAchievements.filter((achievement) => owner.achievementIds.includes(achievement.id)) : [];
      return {
        team,
        owner,
        achievements,
        profileSlug: owner?.slug ?? `open-${team.slug}`,
      };
    });
}

export function getOwnerPortalProfile(slug: string) {
  const permanentOwner = leagueOwners().find((owner) => owner.slug === slug || owner.id === slug);
  if (permanentOwner && !permanentOwner.teamId) {
    return {
      team: permanentOwner.pastTeamIds[0] ? leagueTeams().find((team) => team.id === permanentOwner.pastTeamIds[0]) ?? unassignedTeam : unassignedTeam,
      owner: permanentOwner,
      achievements: db.ownerAchievements.filter((achievement) => permanentOwner.achievementIds.includes(achievement.id)),
      profileSlug: permanentOwner.slug,
    };
  }

  const directory = getOwnerDirectory();
  const activeProfile = directory.find((item) => item.owner?.slug === slug || item.owner?.id === slug);
  if (activeProfile) return activeProfile;

  return directory.find((item) => `open-${item.team.slug}` === slug || item.team.slug === slug || item.team.id === slug) ?? null;
}

export function listOwnerProfileSlugs() {
  const directorySlugs = getOwnerDirectory().map((entry) => entry.profileSlug);
  const historicalSlugs = leagueOwners().filter((owner) => !owner.teamId).map((owner) => owner.slug);
  return [...new Set([...directorySlugs, ...historicalSlugs])];
}

export function getApplicationTeams() {
  return getOwnerDirectory().map(({ team, owner }) => ({
    id: team.id,
    label: team.fullName,
    isOpen: !owner,
  }));
}

export function getUnassignedOwnerProfiles() {
  return leagueOwners().filter((owner) => owner.leagueId === leagueId && !owner.teamId);
}

export function getTeamLotteryData() {
  const league = getLeague();
  const owners = leagueOwners().filter((owner) => owner.leagueId === league.id && owner.status !== "former" && owner.status !== "banned" && owner.status !== "suspended");
  const selections = db.teamLotterySelections.filter((selection) => selection.leagueId === league.id && selection.season === league.season);
  const selectedTeamIds = new Set(selections.map((selection) => selection.teamId));

  return {
    season: league.season,
    poolOwners: owners.map((owner) => ({
      id: owner.id,
      name: owner.name,
      gamertag: owner.gamertag,
      status: owner.status,
      teamSelectionStatus: owner.teamSelectionStatus ?? (owner.teamId ? "team_selected" : "awaiting_lottery"),
    })),
    teams: leagueTeams()
      .filter((team) => team.leagueId === league.id)
      .map((team) => ({
        id: team.id,
        fullName: team.fullName,
        abbreviation: team.abbreviation,
        availableForLottery: !selectedTeamIds.has(team.id),
      })),
    entries: db.teamLotteryEntries.filter((entry) => entry.leagueId === league.id && entry.season === league.season),
    selections,
  };
}

export function ownerStatusLabel(status?: OwnerLeagueStatus, role?: string) {
  if (!status) return "Open Team";
  if (status === "commissioner" || role === "commissioner") return "Commissioner";
  const labels: Record<OwnerLeagueStatus, string> = {
    active: "Active Owner",
    commissioner: "Commissioner",
    open: "Open Team",
    inactive: "Inactive",
    former: "Former Owner",
    suspended: "Suspended",
    banned: "Banned",
  };
  return labels[status];
}

export function applicationStatusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    pending_commissioner_review: "Pending Commissioner Review",
    more_information_requested: "More Information Requested",
    approved: "Approved",
    approved_awaiting_team_assignment: "Approved - Awaiting Lottery",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  return labels[status];
}

export function getPermanentOwnerProfile(ownerId: string) {
  const profile = getOwnerProfile(ownerId);
  if (!profile) return null;

  return {
    ...profile,
    currentMembership: leagueMemberships().find((membership) => membership.ownerId === profile.owner.id),
    protectedFields: [
      "Team assignment",
      "League status",
      "Career record",
      "Playoff record",
      "Championships",
      "Awards",
      "Achievement badges",
      "Hall of Fame status",
      "Disciplinary history",
      "Official league statistics",
      "Commissioner notes",
    ],
  };
}

export function getOwnerStats(owner?: OwnerRecord, team?: TeamRecord) {
  if (!owner) {
    return [
      ["Seasons", "0"],
      ["Career", "0-0"],
      ["Playoffs", "0-0"],
      ["Titles", "0"],
      ["Streak", "0"],
      ["Streams", "0"],
    ];
  }

  return [
    ["Seasons", String(owner.seasonsPlayed)],
    ["Career", owner.careerRecord],
    ["Playoffs", owner.playoffRecord],
    ["Division Titles", String(owner.divisionTitles)],
    ["Conference", String(owner.conferenceChampionships)],
    ["Super Bowls", String(owner.superBowlChampionships)],
    ["Streak", owner.currentWinStreak > 0 ? `W${owner.currentWinStreak}` : "0"],
    ["Streams", String(owner.gamesStreamed)],
    ["Team", team?.abbreviation ?? "FA"],
  ];
}

export function getTeamProfile(teamId: string) {
  const team = leagueTeams().find((item) => item.id === teamId);
  if (!team) return null;
  return {
    team,
    owner: team.ownerId ? leagueOwners().find((owner) => owner.id === team.ownerId) : undefined,
    standing: db.standings.find((standing) => standing.teamId === team.id),
    stats: db.stats.filter((stat) => stat.teamId === team.id),
    games: db.games.filter((game) => game.homeTeamId === team.id || game.awayTeamId === team.id),
  };
}

export function listOwnerIds() {
  return leagueOwners().map((owner) => owner.slug);
}

export function listTeamIds() {
  return db.teams.map((team) => team.id);
}
