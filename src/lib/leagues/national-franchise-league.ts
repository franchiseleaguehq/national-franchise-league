import type { MaddenLeague } from "./types";

export const nationalFranchiseLeague: MaddenLeague = {
  id: "nfl-main",
  slug: "national-franchise-league",
  name: "National Franchise League",
  logoSrc: "/league-logo.png",
  commissioner: "Commissioner Desk",
  platform: "PS5",
  season: 2026,
  week: 1,
  rulesPath: "/rules",
  socials: {
    discord: "https://discord.gg/nationalfranchiseleague",
    twitchChannel: "nationalfranchiseleague",
    youtubeChannel: "https://www.youtube.com/@NFL.Madden25",
    instagram: "https://www.instagram.com/nationalfranchiseleague/",
  },
  teams: [
    { id: "nyg", city: "New York", name: "Giants", fullName: "New York Giants", logoSrc: "/teams/giants.png" },
    { id: "dal", city: "Dallas", name: "Cowboys", fullName: "Dallas Cowboys", logoSrc: "/teams/cowboys.png" },
    { id: "phi", city: "Philadelphia", name: "Eagles", fullName: "Philadelphia Eagles", logoSrc: "/teams/eagles.png" },
    { id: "was", city: "Washington", name: "Commanders", fullName: "Washington Commanders", logoSrc: "/teams/commanders.png" },
    { id: "kc", city: "Kansas City", name: "Chiefs", fullName: "Kansas City Chiefs", logoSrc: "/teams/chiefs.png" },
    { id: "lv", city: "Las Vegas", name: "Raiders", fullName: "Las Vegas Raiders", logoSrc: "/teams/raiders.png" },
    { id: "buf", city: "Buffalo", name: "Bills", fullName: "Buffalo Bills", logoSrc: "/teams/bills.png" },
    { id: "mia", city: "Miami", name: "Dolphins", fullName: "Miami Dolphins", logoSrc: "/teams/dolphins.png" },
  ],
  standings: [],
  schedule: [],
  leaders: [],
  powerRankings: [],
  news: [],
  hallOfFame: [],
};

export const leagueRegistry = [
  nationalFranchiseLeague,
  {
    ...nationalFranchiseLeague,
    id: "eastcoast",
    slug: "eastcoast",
    name: "East Coast Madden League",
  },
  {
    ...nationalFranchiseLeague,
    id: "fridaynightfootball",
    slug: "fridaynightfootball",
    name: "Friday Night Football",
  },
  {
    ...nationalFranchiseLeague,
    id: "nflprime",
    slug: "nflprime",
    name: "NFL Prime Madden",
  },
] satisfies MaddenLeague[];
