export const runtime = "edge";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Crown,
  FileText,
  MessageCircle,
  Newspaper,
  Radio,
  Shield,
  Star,
  Trophy,
  Twitch,
  Users,
  Youtube,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { BroadcastPlayer, KickoffCountdown } from "@/components/broadcast-live-panel";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

type TeamKey =
  | "giants"
  | "cowboys"
  | "eagles"
  | "commanders"
  | "chiefs"
  | "raiders"
  | "bills"
  | "dolphins";

type Team = {
  id: string;
  city: string;
  name: string;
  fullName: string;
  record: string;
  owner: string;
  logoText: string;
  logoSrc: string;
  gradient: string;
};

const homeData = getHomeData();

const leagueConfig = {
  eaFranchiseLeagueId: null,
  platform: homeData.league.platform,
  season: homeData.league.season,
  week: homeData.league.week,
  twitchChannel: homeData.league.twitchChannel,
  youtubeChannel: homeData.league.youtubeChannelUrl,
  dataSources: {
    teams: "local-seed",
    standings: "local-seed",
    schedule: "local-seed",
    stats: "local-seed",
  },
};

const navItems = ["Home", "Rules", "Teams", "Standings", "Schedule", "Stats", "News", "Media", "Hall of Fame", "Commissioner"];

const teams: Record<TeamKey, Team> = {
  giants: {
    id: "nyg",
    city: "New York",
    name: "Giants",
    fullName: "New York Giants",
    record: "7-1",
    owner: "Owner profile ready",
    logoText: "NYG",
    logoSrc: "/teams/giants.png",
    gradient: "from-blue-500/55 via-electric/20 to-black",
  },
  cowboys: {
    id: "dal",
    city: "Dallas",
    name: "Cowboys",
    fullName: "Dallas Cowboys",
    record: "6-2",
    owner: "Owner profile ready",
    logoText: "DAL",
    logoSrc: "/teams/cowboys.png",
    gradient: "from-white/40 via-blue-300/20 to-black",
  },
  eagles: {
    id: "phi",
    city: "Philadelphia",
    name: "Eagles",
    fullName: "Philadelphia Eagles",
    record: "6-2",
    owner: "Owner profile ready",
    logoText: "PHI",
    logoSrc: "/teams/eagles.png",
    gradient: "from-emerald-400/45 via-electric/15 to-black",
  },
  commanders: {
    id: "was",
    city: "Washington",
    name: "Commanders",
    fullName: "Washington Commanders",
    record: "5-3",
    owner: "Owner profile ready",
    logoText: "WAS",
    logoSrc: "/teams/commanders.png",
    gradient: "from-red-500/45 via-yellow-300/15 to-black",
  },
  chiefs: {
    id: "kc",
    city: "Kansas City",
    name: "Chiefs",
    fullName: "Kansas City Chiefs",
    record: "5-3",
    owner: "Owner profile ready",
    logoText: "KC",
    logoSrc: "/teams/chiefs.png",
    gradient: "from-red-500/50 via-white/20 to-black",
  },
  raiders: {
    id: "lv",
    city: "Las Vegas",
    name: "Raiders",
    fullName: "Las Vegas Raiders",
    record: "4-4",
    owner: "Owner profile ready",
    logoText: "LV",
    logoSrc: "/teams/raiders.png",
    gradient: "from-chrome-200/45 via-white/10 to-black",
  },
  bills: {
    id: "buf",
    city: "Buffalo",
    name: "Bills",
    fullName: "Buffalo Bills",
    record: "5-3",
    owner: "Owner profile ready",
    logoText: "BUF",
    logoSrc: "/teams/bills.png",
    gradient: "from-blue-500/55 via-red-500/20 to-black",
  },
  dolphins: {
    id: "mia",
    city: "Miami",
    name: "Dolphins",
    fullName: "Miami Dolphins",
    record: "4-4",
    owner: "Owner profile ready",
    logoText: "MIA",
    logoSrc: "/teams/dolphins.png",
    gradient: "from-cyan-300/50 via-orange-400/15 to-black",
  },
};

const tickerItems = [
  "🔴 LIVE DESK • Madden PS5 franchise football",
  "🏈 Giants vs Cowboys headlines Sunday Night Madden",
  "📺 Watch league broadcasts on Twitch",
  "🎮 Real NFL teams. Competitive Madden owners.",
  "▶️ Highlights and game recaps on YouTube",
  "💬 Discord owner hub active before every advance",
];

const gameDay = {
  status: "NEXT GAME",
  statusTone: "yellow",
  kickoffLabel: "Tonight, 8:00 PM ET",
  kickoffIso: "2026-07-08T20:00:00-04:00",
  streamHref: "https://www.twitch.tv/",
  matchup: {
    away: teams.cowboys,
    home: teams.giants,
  },
};

const standings = homeData.standings;
const leaders = homeData.leaders;
const scores = homeData.scores;
const rankings = homeData.rankings;
const newsItems = homeData.newsItems;
const commissionerHub = homeData.commissionerHub;
const transactions = homeData.transactions;
const schedule = homeData.schedule;

const broadcastDetails = {
  upcomingGames: ["Giants vs Cowboys | Tonight 8:00 PM ET", "Bills vs Dolphins | Monday 9:15 PM ET"],
  streamSchedule: ["Pregame: 7:45 PM ET", "Featured kickoff: 8:00 PM ET", "Postgame recap: final whistle"],
  whoIsLive: "Commissioner selected stream: nationalfranchiseleague",
  viewers: "Viewer count appears when Twitch reports live status",
  recentTitle: "National Franchise League weekly broadcast window",
};

const networkLeagues = [
  ["National Franchise League", "Flagship PS5 Madden franchise broadcast"],
  ["Gridiron Elite League", "Competitive Madden league onboarding soon"],
  ["Madden Dynasty League", "Long-form franchise storytelling placeholder"],
  ["Pro League Simulation", "Simulation ruleset league placeholder"],
  ["College Gridiron Franchise", "Future college-style franchise community"],
];

function LeagueLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-4" aria-label="National Franchise League home">
      <Image
        src="/league-logo.png"
        alt="National Franchise League logo"
        width={compact ? 104 : 180}
        height={compact ? 142 : 246}
        className={`${compact ? "h-24" : "h-36"} w-auto object-contain drop-shadow-[0_0_26px_rgba(0,163,255,0.42)]`}
        priority
      />
      <div className="leading-none">
        <p className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white md:text-3xl">National</p>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-chrome-300">Franchise League</p>
      </div>
    </Link>
  );
}

function TeamLogoPlaceholder({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "size-12 text-lg",
    md: "size-20 text-3xl",
    lg: "size-24 text-4xl",
  };

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-md border border-white/20 bg-gradient-to-br ${team.gradient} font-[var(--font-oswald)] font-bold text-white shadow-electric ${sizes[size]}`}
      data-logo-src={team.logoSrc}
      aria-label={`${team.fullName} logo placeholder`}
    >
      {team.logoText}
    </div>
  );
}

function TeamCard({ team, align = "left" }: { team: Team; align?: "left" | "right" }) {
  return (
    <Link href={`/teams/${team.id}`} className={`interactive-card block rounded-md border border-white/12 bg-black/40 p-4 shadow-chrome backdrop-blur ${align === "right" ? "text-right" : "text-left"}`}>
      <div className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <TeamLogoPlaceholder team={team} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{team.city}</p>
          <h3 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">{team.name}</h3>
          <p className="mt-2 text-sm font-semibold text-chrome-300">{team.record} | {team.owner}</p>
        </div>
      </div>
    </Link>
  );
}

function GameStatusBadge({ status, tone }: { status: string; tone: string }) {
  const tones: Record<string, string> = {
    green: "bg-emerald-500 text-black shadow-[0_0_24px_rgba(16,185,129,0.65)]",
    yellow: "bg-yellow-400 text-black shadow-[0_0_24px_rgba(250,204,21,0.55)]",
    red: "bg-red-600 text-white shadow-[0_0_24px_rgba(239,68,68,0.65)]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${tones[tone] ?? tones.red}`}>
      {status === "LIVE NOW" ? "🟢" : status === "NEXT GAME" ? "🟡" : "🔴"} {status}
    </span>
  );
}

function PremiumButton({ href, icon: Icon, children, variant = "chrome", tone = "blue" }: { href: string; icon: LucideIcon; children: React.ReactNode; variant?: "chrome" | "electric"; tone?: "red" | "pink" | "blue" | "violet" }) {
  const tones = {
    red: "bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.6)]",
    pink: "bg-pink-500 text-white shadow-[0_0_24px_rgba(236,72,153,0.55)]",
    blue: "bg-electric text-black shadow-electric",
    violet: "bg-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.55)]",
  };

  return (
    <Button asChild size="xl" variant={variant} className="group min-h-14 justify-center overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-electric">
      <Link href={href}>
        <span className={`grid size-8 place-items-center rounded-full transition duration-300 group-hover:scale-110 ${tones[tone]}`}>
          <Icon className="size-4" />
        </span>
        {children}
        <ArrowUpRight className="ml-auto size-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </Link>
    </Button>
  );
}

function SectionHeader({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: LucideIcon }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
          <Icon className="size-4" />
          {eyebrow}
        </p>
        <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white md:text-4xl">{title}</h2>
      </div>
      <Link href="#" className="hidden items-center gap-1 text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white md:flex">
        View all
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

function SportsTicker() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-y border-white/10 bg-black/90 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="grid h-14 grid-cols-[auto_1fr] items-center overflow-hidden">
        <div className="flex h-full items-center border-r border-white/10 bg-red-600 px-4 font-[var(--font-oswald)] text-sm font-bold uppercase tracking-[0.14em] text-white md:px-6">Live Desk</div>
        <div className="overflow-hidden">
          <div className="flex min-w-max animate-ticker items-center">
            {items.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span className="mx-5 h-2 w-2 rounded-full bg-electric shadow-electric" />
                <span className="font-[var(--font-oswald)] text-sm font-semibold uppercase tracking-[0.12em] text-white md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TwitchPanel() {
  const twitchEmbedUrl = `https://player.twitch.tv/?channel=${leagueConfig.twitchChannel}&parent=localhost&muted=true`;

  return (
    <article className="premium-card interactive-card rounded-md border border-white/12 p-4 shadow-chrome backdrop-blur-xl md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Twitch className="size-4" />
            Live on Twitch
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Broadcast Control</h2>
        </div>
        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200">Offline</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_25%,rgba(0,163,255,0.24),rgba(0,0,0,0.78)_62%)]">
        <iframe
          className="absolute inset-0 size-full"
          src={twitchEmbedUrl}
          title="National Franchise League Twitch live feed"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-4 grid max-h-64 gap-3 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
        <div className="rounded-md border border-white/10 bg-black/35 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">Upcoming Games</p>
          <div className="mt-2 space-y-1 text-sm text-chrome-200">
            {broadcastDetails.upcomingGames.map((game) => <p key={game}>{game}</p>)}
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-black/35 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">Stream Schedule</p>
          <div className="mt-2 space-y-1 text-sm text-chrome-200">
            {broadcastDetails.streamSchedule.map((slot) => <p key={slot}>{slot}</p>)}
          </div>
        </div>
        {[
          ["Who's Live", broadcastDetails.whoIsLive],
          ["Viewers", broadcastDetails.viewers],
          ["Recent Stream Title", broadcastDetails.recentTitle],
          ["Future Switcher", "Commissioner-selected owner streams will rotate into this homepage player."],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-black/35 p-3 text-sm">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-electric">{label}</span>
            <span className="mt-1 block text-chrome-200">{value}</span>
          </div>
        ))}
      </div>

      <Button asChild variant="electric" size="lg" className="mt-4 w-full">
        <Link href={`https://www.twitch.tv/${leagueConfig.twitchChannel}`} target="_blank" rel="noreferrer">
          <Twitch />
          Watch on Twitch
        </Link>
      </Button>
    </article>
  );
}

function YouTubeShortsPanel() {
  const shorts = [
    ["Week 1 Logo Reveal", "League trailer cutdowns and team identity moments."],
    ["Giants vs Cowboys Preview", "Reels-ready matchup package for the featured game."],
    ["Top Plays", "Latest user highlights, walk-offs, and defensive stands."],
  ];

  return (
    <article className="premium-card interactive-card rounded-md border border-white/12 p-4 shadow-chrome backdrop-blur-xl md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Youtube className="size-4" />
            YouTube Reels
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Latest Shorts Feed</h2>
        </div>
        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200">Auto-ready</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {shorts.map(([title, note], index) => (
          <Link key={title} href={leagueConfig.youtubeChannel} target="_blank" rel="noreferrer" className="interactive-card relative aspect-[9/16] overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(239,68,68,0.28),rgba(0,0,0,0.82)_58%)] p-3">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.78)_76%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="grid size-10 place-items-center rounded-full bg-red-600 text-white shadow-[0_0_24px_rgba(239,68,68,0.55)]">
                <Youtube className="size-5" />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Short {index + 1}</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">{title}</p>
                <p className="mt-2 text-sm leading-6 text-chrome-100">{note}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Button asChild variant="chrome" size="lg" className="mt-4 w-full">
        <Link href={leagueConfig.youtubeChannel} target="_blank" rel="noreferrer">
          <Youtube />
          View More Shorts
        </Link>
      </Button>
    </article>
  );
}

function MiniTable({ rows }: { rows: string[][] }) {
  return (
    <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
      {rows.map((row) => (
        <div key={row.join("-")} className="interactive-card rounded-md border border-white/10 bg-black/35 p-2.5">
          <div className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3">
            <span className="font-[var(--font-oswald)] text-xl font-bold text-electric">{row[0]}</span>
            <span className="font-semibold text-white">{row[1]}</span>
            <span className="text-chrome-200">{row[2]}</span>
            <span className="text-sm font-bold text-electric">{row[3]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black pb-14 text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
          <LeagueLogo compact />
          <div className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200 xl:flex">
            {navItems.map((item) => (
              <Link href={item === "Home" ? "/" : `/${item.toLowerCase().replaceAll(" ", "-")}`} key={item} className="relative transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-electric after:transition-all hover:text-white hover:after:w-full">
                {item}
              </Link>
            ))}
          </div>
          <Button asChild variant="electric" size="sm" className="hidden sm:inline-flex">
            <Link href="https://www.twitch.tv/" target="_blank" rel="noreferrer">
              <Radio className="size-4" />
              Live
            </Link>
          </Button>
        </div>
      </nav>

      <section className="relative h-[100svh] min-h-[680px] overflow-hidden pt-24">
        <Image src="/stadium-hero.png" alt="Cinematic football stadium lights and fog" fill priority className="object-cover animate-[stadiumDrift_22s_ease-in-out_infinite]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.78)_38%,rgba(0,0,0,0.34)_72%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(0,163,255,0.34),transparent_30%),radial-gradient(circle_at_22%_76%,rgba(255,255,255,0.13),transparent_26%)]" />
        <div className="absolute inset-0 grid-fade opacity-35" />
        <div className="hero-fog absolute inset-x-[-12%] bottom-[-8%] h-64 animate-pulseGlow opacity-75" />
        <div className="light-sweep absolute left-[-18%] top-0 h-full w-1/3 animate-[float_9s_ease-in-out_infinite] opacity-55" />

        <div className="relative z-10 mx-auto grid h-[calc(100svh-6rem)] max-w-7xl items-center gap-6 px-5 py-4 md:px-8 xl:grid-cols-[0.76fr_1.24fr]">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-electric shadow-electric backdrop-blur">Season Trailer</span>
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">Madden PS5 Network</span>
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-chrome-200">Week {leagueConfig.week}</span>
            </div>

            <Image
              src="/league-logo.png"
              alt="National Franchise League logo"
              width={240}
              height={330}
              className="mb-4 h-32 w-auto object-contain drop-shadow-[0_0_36px_rgba(0,163,255,0.46)] md:h-40"
              priority
            />

            <h1 className="chrome-text font-[var(--font-oswald)] text-5xl font-bold uppercase leading-[0.9] md:text-7xl xl:text-8xl">National Franchise League</h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-chrome-100 md:text-xl">
              The premier Madden franchise football experience.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-chrome-300 md:text-base">
              Competitive PlayStation 5 owners, real NFL teams, broadcast-ready game nights, commissioner tools, highlights, and league storytelling under one professional Madden network.
            </p>

            <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              <PremiumButton href="/schedule" icon={CalendarDays} variant="electric">View Schedule</PremiumButton>
              <PremiumButton href="/rules" icon={FileText}>League Rules</PremiumButton>
              <PremiumButton href="https://discord.com/" icon={MessageCircle} tone="violet">Join Discord</PremiumButton>
            </div>
          </div>

          <BroadcastPlayer />
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,#05070a_0%,#0b0e12_45%,#05070a_100%)] py-16 md:py-24">
        <div className="absolute inset-0 grid-fade opacity-20" />

        <div className="relative mx-auto mb-6 max-w-7xl px-5 md:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                <Radio className="size-4" />
                Live Game Center
              </p>
              <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">Live Game Center</h2>
              <p className="mt-4 max-w-3xl leading-8 text-chrome-300">
                Live games, stream status, community reactions, YouTube reels, and short-form highlights live below the main league trailer.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <TwitchPanel />
            <YouTubeShortsPanel />
          </div>
        </div>

        <div className="relative mx-auto mb-6 max-w-7xl px-5 md:px-8">
          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-5 backdrop-blur-xl md:p-7">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                  <Zap className="size-4" />
                  Game of the Week
                </p>
                <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">Giants vs Cowboys</h2>
              </div>
              <GameStatusBadge status={gameDay.status} tone={gameDay.statusTone} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
              <TeamCard team={gameDay.matchup.away} />
              <div className="grid place-items-center rounded-md border border-electric/40 bg-electric/10 px-6 py-5 text-center shadow-electric">
                <p className="font-[var(--font-oswald)] text-5xl font-bold uppercase text-white">VS</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-electric">{gameDay.kickoffLabel}</p>
                <Button asChild variant="electric" size="lg" className="mt-5 w-full transition duration-300 hover:-translate-y-1 hover:shadow-electric">
                  <Link href={gameDay.streamHref} target="_blank" rel="noreferrer">
                    <Twitch />
                    Watch Live
                  </Link>
                </Button>
              </div>
              <TeamCard team={gameDay.matchup.home} align="right" />
            </div>

            <div className="mt-5 max-w-md">
              <KickoffCountdown kickoffIso={gameDay.kickoffIso} />
            </div>
          </article>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-6 px-5 md:px-8 xl:grid-cols-3">
          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Standings" title="Standings" icon={Trophy} />
            <MiniTable rows={standings} />
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Stats Desk" title="League Leaders" icon={Star} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {leaders.map(([category, player, team, stat, extra]) => (
                <div key={category} className="interactive-card rounded-md border border-white/10 bg-black/35 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{category}</p>
                  <h3 className="mt-1 font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{player}</h3>
                  <p className="mt-1 text-sm text-chrome-300">{team}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-chrome-300">{stat} | {extra}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Game Day" title="Matchup Hub" icon={CalendarDays} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {schedule.map(([day, home, away, time]) => (
                <div key={`${home}-${away}`} className="interactive-card grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-black/35 p-2.5">
                  <span className="font-[var(--font-oswald)] text-xl font-bold text-electric">{day}</span>
                  <span className="font-semibold text-white">{home} vs {away}</span>
                  <span className="text-sm text-chrome-300">{time}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Power" title="Rankings" icon={Shield} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {rankings.map(([rank, team, note]) => (
                <div key={team} className="interactive-card grid grid-cols-[2rem_1fr] gap-3 rounded-md border border-white/10 bg-black/35 p-2.5">
                  <span className="font-[var(--font-oswald)] text-2xl font-bold text-electric">{rank}</span>
                  <span>
                    <span className="block font-semibold text-white">{team}</span>
                    <span className="text-sm text-chrome-300">{note}</span>
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="News" title="League News" icon={Newspaper} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {newsItems.map(([label, item]) => (
                <div key={item} className="interactive-card rounded-md border border-white/10 bg-black/35 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{label}</p>
                  <p className="mt-2 text-chrome-100">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Scoreboard" title="Latest Scores" icon={Zap} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {scores.map(([away, home, awayScore, homeScore, status]) => (
                <div key={`${away}-${home}`} className="interactive-card rounded-md border border-white/10 bg-black/35 p-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-electric">
                    <span>{status}</span>
                    <span>Week {leagueConfig.week}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between"><span>{away}</span><strong className="font-[var(--font-oswald)] text-2xl">{awayScore}</strong></div>
                    <div className="flex items-center justify-between"><span>{home}</span><strong className="font-[var(--font-oswald)] text-2xl">{homeScore}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Commissioner" title="Commissioner Hub" icon={Bell} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {commissionerHub.map(([title, item]) => (
                <div key={title} className="interactive-card rounded-md border border-white/10 bg-black/35 p-3 text-chrome-100">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{title}</p>
                  <p className="mt-2">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Transactions" title="Recent Moves" icon={Users} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {transactions.map(([team, move]) => (
                <div key={move} className="interactive-card rounded-md border border-white/10 bg-black/35 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{team}</p>
                  <p className="mt-2 text-chrome-100">{move}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-4 backdrop-blur-xl">
            <SectionHeader eyebrow="Legacy" title="Hall of Fame Preview" icon={Crown} />
            <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {["Champions", "Award Winners", "Record Breakers"].map((item) => (
                <div key={item} className="interactive-card rounded-md border border-white/10 bg-black/35 p-4">
                  <div className="mb-3 grid size-10 place-items-center rounded-full bg-electric text-black shadow-electric"><Crown className="size-5" /></div>
                  <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{item}</h3>
                  <p className="mt-3 leading-7 text-chrome-300">Premium Madden franchise history under the National Franchise League umbrella.</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="relative mx-auto mt-8 max-w-7xl px-5 md:px-8">
          <article className="premium-card scroll-reveal interactive-card rounded-md border border-white/12 p-5 backdrop-blur-xl md:p-7">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                  <Radio className="size-4" />
                  Future Multi-League Network
                </p>
                <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">Part of the NFL Network</h2>
                <p className="mt-4 max-w-3xl leading-8 text-chrome-300">
                  A future umbrella for premium Madden franchise leagues that want broadcast-quality pages, commissioner tooling, and automatic data updates.
                </p>
              </div>
              <Button asChild variant="electric" size="lg">
                <Link href="/submit-league">
                  <Users />
                  Submit Your League
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {networkLeagues.map(([name, note]) => (
                <div key={name} className="interactive-card rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{name}</p>
                  <p className="mt-2 text-sm leading-6 text-chrome-300">{note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <LeagueLogo compact />
          <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-[0.16em] text-chrome-300">
            {["Twitch", "Instagram", "YouTube", "Discord", "Contact"].map((item) => <Link key={item} href="#" className="transition hover:text-white">{item}</Link>)}
          </div>
          <p className="text-sm text-chrome-400">Competitive Madden franchise league on PlayStation 5. Contact: commissioner@nationalfranchiseleague.com | Copyright 2026 National Franchise League.</p>
        </div>
      </footer>

      <SportsTicker />
    </main>
  );
}
