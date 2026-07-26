import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Gamepad2,
  Home,
  Radio,
  Scale,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "League Rules | National Franchise League",
  description: "Official Madden PS5 franchise league rulebook for the National Franchise League.",
};

const navItems = ["Home", "Rules", "Teams", "Standings", "Schedule", "Stats", "News", "Media", "Hall of Fame", "Commissioner"];

const ruleSections = [
  {
    title: "League Settings",
    summary: "Baseline Madden PS5 franchise settings for every owner and matchup.",
    rules: [
      "The National Franchise League is a competitive Madden franchise league played on PlayStation 5.",
      "Difficulty is All-Madden.",
      "Quarter length is 7 minutes.",
      "Play cooldown is 5.",
      "Play limit is 4.",
      "GroupMe is required for league communication, scheduling, announcements, and commissioner rulings.",
    ],
  },
  {
    title: "Advance Schedule",
    summary: "Official league advance cadence and commissioner window.",
    rules: [
      "Advance days are Wednesday and Sunday.",
      "The advance window is 3-5 PM EST.",
      "Owners are responsible for completing games before the published advance window.",
      "Commissioners may delay an advance for verified scheduling issues, playoff broadcasts, or league-wide technical problems.",
    ],
  },
  {
    title: "Streaming Rules",
    summary: "Broadcast expectations for featured games, playoffs, and league content.",
    rules: [
      "Streaming is required for Games of the Week and playoff games.",
      "Owners should archive or upload VODs when requested by the commissioner team.",
      "Streams must clearly show gameplay, score, and game clock whenever possible.",
      "If a required stream fails because of a platform issue, notify the commissioner team immediately in GroupMe.",
    ],
  },
  {
    title: "Game of the Week",
    summary: "Featured broadcast matchups and league media standards.",
    rules: [
      "The commissioner team selects Game of the Week matchups based on standings, rivalries, playoff stakes, and broadcast value.",
      "Games of the Week receive priority promotion on the league homepage, ticker, and social channels.",
      "Selected owners must coordinate kickoff times early and be prepared to stream.",
      "Game of the Week updates may include matchup graphics, owner notes, and postgame highlights.",
    ],
  },
  {
    title: "Scheduling Rules",
    summary: "How owners must communicate, confirm, and document game times.",
    rules: [
      "Games must be scheduled with proof.",
      "Scheduling proof can include GroupMe messages, screenshots, direct messages, or other commissioner-approved records.",
      "No response within 10 hours can result in a force win.",
      "Owners should offer realistic availability windows and communicate early if a conflict appears.",
      "Repeated scheduling avoidance may lead to strikes, force losses, or removal from the league.",
    ],
  },
  {
    title: "Gameplay Rules",
    summary: "Competitive play standards for sim-style Madden franchise football.",
    rules: [
      "No quitting.",
      "No excessive QB dropbacks.",
      "Owners are expected to mix concepts, formations, and play calls within the play cooldown and play limit structure.",
      "Exploit abuse, glitch play, or intentionally unrealistic gameplay can be reviewed by the commissioner team.",
      "Run clock, tempo, and late-game decisions should reflect competitive football strategy, not rule manipulation.",
    ],
  },
  {
    title: "4th Down Rules",
    summary: "Situational conversion standards to keep gameplay fair and realistic.",
    rules: [
      "Owners should treat 4th down as a realistic football decision based on score, field position, time, and game situation.",
      "Excessive or unrealistic 4th down attempts may be reviewed by the commissioner team.",
      "Late-game comeback situations, short-yardage decisions, and midfield calls should be explainable if challenged.",
      "Commissioner decisions on 4th down abuse are final after review.",
    ],
  },
  {
    title: "2-Point Conversion Rules",
    summary: "Conversion attempts should match real game context.",
    rules: [
      "2-point conversions must be tied to a reasonable scoreboard or late-game strategy.",
      "Owners may not spam 2-point attempts simply to exploit a play, formation, or defensive look.",
      "Repeated abuse of 2-point attempts can result in commissioner review and strikes.",
    ],
  },
  {
    title: "Substitution Rules",
    summary: "Position integrity and roster usage expectations.",
    rules: [
      "No illegal position subs.",
      "Players must be used in positions and packages that fit league standards and Madden franchise integrity.",
      "Depth chart manipulation, package abuse, or unrealistic substitutions may be reversed or penalized.",
      "Commissioners may request lineup screenshots during review.",
    ],
  },
  {
    title: "Trade Rules",
    summary: "Trade limits, approvals, and competitive balance protections.",
    rules: [
      "No CPU trades.",
      "Trades require committee approval.",
      "Each team is allowed 6 trades per season: 3 offseason and 3 regular season.",
      "Both owners must confirm accepted trades in GroupMe before committee review.",
      "The committee may reject trades that damage league balance, appear collusive, or exploit inexperienced owners.",
    ],
  },
  {
    title: "Free Agency Rules",
    summary: "Claiming players and maintaining fair roster access.",
    rules: [
      "Free agency activity must follow commissioner announcements and league timing windows.",
      "Owners may not dump players into free agency to bypass trade review or roster rules.",
      "High-impact free agents may be subject to waiver order, commissioner approval, or temporary holds.",
      "Any accidental drop should be reported immediately before another owner claims the player.",
    ],
  },
  {
    title: "Roster Rules",
    summary: "Team-building standards across the Madden franchise season.",
    rules: [
      "Owners must maintain legal Madden rosters and depth charts.",
      "Roster construction should protect competitive balance and avoid obvious cap, position, or gameplay exploits.",
      "The commissioner team may require roster corrections before advance.",
      "Repeated roster violations can lead to strikes, reversed transactions, or owner review.",
    ],
  },
  {
    title: "Disconnect Rules",
    summary: "How owners handle lag-outs, crashes, and interrupted games.",
    rules: [
      "Owners must immediately communicate in GroupMe after a disconnect.",
      "If both owners agree on a fair restart, replay, or score recreation, the commissioner team can approve it.",
      "Intentional disconnects are treated as quitting and may result in a force loss or strike.",
      "Commissioners may use score, time, possession, stream evidence, and owner history when deciding outcomes.",
    ],
  },
  {
    title: "CPU Game Rules",
    summary: "Stat caps and expectations when playing against CPU-controlled teams.",
    rules: [
      "CPU game stat caps are QB 400 passing yards, RB 250 rushing yards, and WR/TE 250 receiving yards.",
      "Owners may not use CPU games to farm awards, dev traits, records, or unrealistic stat lines.",
      "Blowout CPU games should be managed responsibly with backups, clock control, and balanced play calling.",
      "Stat cap violations can lead to player suspensions, stat penalties, or strikes.",
    ],
  },
  {
    title: "Strike System",
    summary: "Accountability model for missed games, rule violations, and conduct issues.",
    rules: [
      "Strikes may be issued for missed scheduling, quitting, rule violations, poor communication, or conduct problems.",
      "Repeated strikes can lead to force losses, transaction restrictions, playoff ineligibility, or removal from the league.",
      "The commissioner team may escalate penalties for severe or repeated violations.",
      "Owners can ask for clarification, but final enforcement belongs to the commissioner team.",
    ],
  },
  {
    title: "Player Upgrades",
    summary: "Development rewards and commissioner-approved upgrade standards.",
    rules: [
      "13+ human games can earn a Normal to Star upgrade.",
      "The Super Bowl winner can upgrade a drafted rookie to Star.",
      "Upgrade eligibility must be reviewed by the commissioner team before changes are applied.",
      "CPU farming, stat padding, or rule violations can make a player ineligible for upgrades.",
    ],
  },
  {
    title: "Commissioner Decisions",
    summary: "Final authority for disputes, edge cases, and rule interpretation.",
    rules: [
      "Commissioner decisions are final after review.",
      "The commissioner team may use streams, screenshots, GroupMe messages, Madden results, and owner history when ruling.",
      "Rules can be clarified or amended when league integrity requires it.",
      "Owners are expected to respect rulings even when they disagree with the outcome.",
    ],
  },
  {
    title: "Owner Conduct",
    summary: "Community standards for a competitive but respectful Madden league.",
    rules: [
      "Trash talk is allowed but no personal insults.",
      "Harassment, threats, discriminatory language, or repeated personal attacks are not allowed.",
      "Owners must represent the National Franchise League with professionalism in streams, chats, and league media.",
      "Competitive intensity is encouraged; disrespecting the league, commissioners, or other owners is not.",
    ],
  },
];

function LeagueLogo() {
  return (
    <Link href="/" className="flex items-center gap-4" aria-label="National Franchise League home">
      <Image
        src="/league-logo.png"
        alt="National Franchise League logo"
        width={112}
        height={152}
        className="h-20 w-auto object-contain drop-shadow-[0_0_26px_rgba(0,163,255,0.42)]"
        priority
      />
      <div className="leading-none">
        <p className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white md:text-3xl">National</p>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-chrome-300">Franchise League</p>
      </div>
    </Link>
  );
}

function RuleAccordionCard({ section, index }: { section: (typeof ruleSections)[number]; index: number }) {
  return (
    <details className="group premium-card interactive-card scroll-reveal rounded-md border border-white/12 p-0 backdrop-blur-xl" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden md:p-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-electric text-sm font-black text-black shadow-electric">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Rule Section</p>
          </div>
          <h2 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white md:text-4xl">
            {section.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-chrome-300 md:text-base">{section.summary}</p>
        </div>
        <ChevronDown className="size-6 shrink-0 text-electric transition duration-300 group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 px-5 pb-5 md:px-6 md:pb-6">
        <ul className="mt-5 grid gap-3">
          {section.rules.map((rule) => (
            <li key={rule} className="rounded-md border border-white/10 bg-black/35 p-4 leading-7 text-chrome-100">
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export default function RulesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
          <LeagueLogo />
          <div className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200 xl:flex">
            {navItems.map((item) => (
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
                className="relative transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-electric after:transition-all hover:text-white hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </div>
          <Button asChild variant="electric" size="sm" className="hidden sm:inline-flex">
            <Link href="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32">
        <Image src="/stadium-hero.png" alt="Football stadium lights" fill priority className="object-cover opacity-70 animate-[stadiumDrift_24s_ease-in-out_infinite]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(0,163,255,0.28),transparent_32%),radial-gradient(circle_at_20%_78%,rgba(255,255,255,0.12),transparent_30%)]" />
        <div className="absolute inset-0 grid-fade opacity-30" />
        <div className="hero-fog absolute inset-x-[-12%] bottom-[-12%] h-64 animate-pulseGlow opacity-70" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-electric shadow-electric">
                <ShieldCheck className="size-4" />
                Official Constitution
              </span>
              <span className="rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome-200 backdrop-blur">
                Madden PS5 Franchise
              </span>
            </div>

            <Image
              src="/league-logo.png"
              alt="National Franchise League logo"
              width={180}
              height={246}
              className="mb-6 h-36 w-auto object-contain drop-shadow-[0_0_34px_rgba(0,163,255,0.46)] md:h-44"
              priority
            />
            <h1 className="chrome-text font-[var(--font-oswald)] text-5xl font-bold uppercase leading-[0.92] md:text-7xl xl:text-8xl">
              National Franchise League Official Rulebook
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-chrome-100 md:text-2xl">
              Madden PS5 Franchise League Rules &amp; Standards
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-chrome-300">
              The official operating standard for competitive games, scheduling, streaming, trades, conduct, and commissioner decisions inside the National Franchise League.
            </p>
          </div>

          <aside className="premium-card interactive-card rounded-md border border-white/12 p-5 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <Gamepad2 className="size-4" />
              Core Settings
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Difficulty", "All-Madden"],
                ["Quarters", "7 Min"],
                ["Cooldown", "5"],
                ["Play Limit", "4"],
                ["Advance", "Wed/Sun"],
                ["Platform", "PS5"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">{label}</p>
                  <p className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{value}</p>
                </div>
              ))}
            </div>
            <Button disabled variant="chrome" size="lg" className="mt-5 w-full">
              <Download className="size-5" />
              Download Rulebook PDF
            </Button>
          </aside>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,#05070a_0%,#0b0e12_48%,#05070a_100%)] py-14 md:py-20">
        <div className="absolute inset-0 grid-fade opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              [CalendarDays, "Advance", "Wednesday and Sunday, 3-5 PM EST"],
              [Radio, "Streaming", "Required for Game of the Week and playoffs"],
              [Scale, "Trades", "Committee approval, no CPU trades"],
              [Users, "Conduct", "Trash talk allowed, no personal insults"],
            ].map(([Icon, title, copy]) => {
              const RuleIcon = Icon as typeof CalendarDays;
              return (
                <article key={title as string} className="premium-card interactive-card rounded-md border border-white/12 p-5 backdrop-blur-xl">
                  <RuleIcon className="size-6 text-electric" />
                  <h2 className="mt-4 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-chrome-300">{copy as string}</p>
                </article>
              );
            })}
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                <FileText className="size-4" />
                Rulebook Index
              </p>
              <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">
                League Constitution
              </h2>
            </div>
            <Button asChild variant="electric" size="lg">
              <Link href="/">
                <Trophy className="size-5" />
                Back to League Hub
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {ruleSections.map((section, index) => (
              <RuleAccordionCard key={section.title} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
