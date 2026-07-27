import { db } from "./seed";
import type { OwnerRecord, TeamRecord } from "./schema";

const leagueId = "league_nfl";

function teamName(teamId: string) {
  return db.teams.find((team) => team.id === teamId)?.fullName ?? "Unknown Team";
}

function teamRecord(teamId: string) {
  const standing = db.standings.find((row) => row.teamId === teamId);
  return standing ? `${standing.wins}-${standing.losses}` : "0-0";
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
    teams: db.teams.filter((team) => team.leagueId === league.id),
    owners: db.owners.filter((owner) => owner.leagueId === league.id),
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
  return {
    league,
    pendingTrades: db.trades.filter((trade) => trade.leagueId === league.id && trade.status === "pending"),
    announcements: db.announcements.filter((item) => item.leagueId === league.id),
    owners: db.owners.filter((owner) => owner.leagueId === league.id),
    teams: db.teams.filter((team) => team.leagueId === league.id),
    applications: db.applications.filter((application) => application.leagueId === league.id),
    achievements: db.ownerAchievements,
    games: db.games.filter((game) => game.leagueId === league.id),
    rules: db.rules.filter((rule) => rule.leagueId === league.id).sort((a, b) => a.order - b.order),
  };
}

export function getOwnerProfile(ownerId: string) {
  const owner = db.owners.find((item) => item.id === ownerId || item.slug === ownerId);
  if (!owner) return null;
  return {
    owner,
    team: owner.teamId ? db.teams.find((team) => team.id === owner.teamId) : undefined,
    games: db.games.filter((game) => game.homeTeamId === owner.teamId || game.awayTeamId === owner.teamId),
    achievements: db.ownerAchievements.filter((achievement) => owner.achievementIds.includes(achievement.id)),
  };
}

export function getOwnerDirectory() {
  const league = getLeague();
  const owners = db.owners.filter((owner) => owner.leagueId === league.id);

  return db.teams
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
  const directory = getOwnerDirectory();
  const activeProfile = directory.find((item) => item.owner?.slug === slug || item.owner?.id === slug);
  if (activeProfile) return activeProfile;

  return directory.find((item) => `open-${item.team.slug}` === slug || item.team.slug === slug || item.team.id === slug) ?? null;
}

export function listOwnerProfileSlugs() {
  return getOwnerDirectory().map((entry) => entry.profileSlug);
}

export function getApplicationTeams() {
  return getOwnerDirectory().map(({ team, owner }) => ({
    id: team.id,
    label: team.fullName,
    isOpen: !owner,
  }));
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
  const team = db.teams.find((item) => item.id === teamId);
  if (!team) return null;
  return {
    team,
    owner: team.ownerId ? db.owners.find((owner) => owner.id === team.ownerId) : undefined,
    standing: db.standings.find((standing) => standing.teamId === team.id),
    stats: db.stats.filter((stat) => stat.teamId === team.id),
    games: db.games.filter((game) => game.homeTeamId === team.id || game.awayTeamId === team.id),
  };
}

export function listOwnerIds() {
  return db.owners.map((owner) => owner.slug);
}

export function listTeamIds() {
  return db.teams.map((team) => team.id);
}
