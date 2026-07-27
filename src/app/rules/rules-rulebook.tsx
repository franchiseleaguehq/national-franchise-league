"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Gamepad2,
  Gavel,
  HelpCircle,
  Home,
  ListChecks,
  Menu,
  Radio,
  Scale,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  leagueBasics,
  madden27ReviewTopics,
  originalNotionStatements,
  rookieOrientation,
  rulebookCategories,
  rulebookMeta,
  rulebookQuickStats,
  whatsNew,
} from "./rulebook-data";
import type { RulebookRule } from "./rulebook-data";

const navItems = ["Home", "Rules", "Teams", "Standings", "Schedule", "Stats", "News", "Media", "Hall of Fame", "Commissioner"];
const unknownAnswer = "This situation is not specifically covered by the official rulebook. Contact the commissioner for a ruling.";

type Label = "ALLOWED" | "NOT ALLOWED" | "REQUIRED" | "COMMISSIONER DECISION" | "PENALTY";
type DisplayCategory = {
  title: string;
  summary: string;
  icon: LucideIcon;
  rules: RulebookRule[];
};
type SearchResult = {
  category: string;
  rule: RulebookRule;
  score: number;
  answer: string;
  penalty: string | null;
};
type ChatMessage = {
  role: "owner" | "assistant";
  text: string;
  category?: string;
  ruleTitle?: string;
  ruleId?: string;
};

const categorySpecs: Array<{ title: string; summary: string; icon: LucideIcon; ruleTitles: string[] }> = [
  {
    title: "Getting Started",
    summary: "League identity, owner expectations, setup, and communication basics.",
    icon: BookOpen,
    ruleTitles: [
      "Realistic Competition. Integrity. Flexibility for Busy Players.",
      "💬 Part 4 - Communication",
    ],
  },
  {
    title: "League Settings",
    summary: "Core Madden franchise settings every owner should know before kickoff.",
    icon: Settings,
    ruleTitles: ["⚙️ Part 1 — League Setup & Schedule"],
  },
  {
    title: "Scheduling and Advances",
    summary: "Advance timing, 10-hour response windows, force wins, and sim outcomes.",
    icon: CalendarDays,
    ruleTitles: ["🕒 Scheduling & Sim Policy", "💬 Part 4 - Communication"],
  },
  {
    title: "Gameplay",
    summary: "Realistic football standards, exploit prevention, pauses, defense, and game flow.",
    icon: Gamepad2,
    ruleTitles: [
      "⏸️ Part 5 — Pause & In-Game Communication",
      "🧠 Part 11 — Gameplay Conduct",
      "🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules",
    ],
  },
  {
    title: "Fourth Down",
    summary: "When owners may go for it and when they must punt.",
    icon: ShieldAlert,
    ruleTitles: ["🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules"],
  },
  {
    title: "Two-Point Conversions",
    summary: "When two-point attempts are allowed.",
    icon: CheckCircle2,
    ruleTitles: ["🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules"],
  },
  {
    title: "Sportsmanship and Quitting",
    summary: "Respect standards, no-quitting rules, disconnects, and league conduct.",
    icon: Users,
    ruleTitles: [
      "📖 Part 2 — No Quitting Policy",
      "\n💪 Part 3 -Sportsmanship & Conduct",
      "⚡ Part 13-Disconnections",
    ],
  },
  {
    title: "Streaming and Games of the Week",
    summary: "Mandatory streaming, Games of the Week, playoff streams, rewards, and highlights.",
    icon: Radio,
    ruleTitles: ["📺 Part 6 — Streaming & Game of the Week", "🏟️ Playoff Streaming Rotation:"],
  },
  {
    title: "Trades",
    summary: "Trade committee approval, trade limits, anti-collusion, and CPU trade restrictions.",
    icon: Scale,
    ruleTitles: ["💰 Part 8 — Salary Cap & Trading Rules"],
  },
  {
    title: "Franchise Management and Player Personnel",
    summary: "Salary cap, team lottery, free agency, season rewards, and editing policy.",
    icon: ClipboardCheck,
    ruleTitles: [
      "💰 Part 8 — Salary Cap & Trading Rules",
      "🧾 Part 9 — Team Lottery & Free Agency System",
      "📺 Part 6 — Streaming & Game of the Week",
      "🧩 Part 10 — Illegal Subs / Roster Rules / Editing",
    ],
  },
  {
    title: "Rosters and Position Changes",
    summary: "Illegal substitutions, roster minimums, FB policy, and player editing.",
    icon: ListChecks,
    ruleTitles: ["🧩 Part 10 — Illegal Subs / Roster Rules / Editing"],
  },
  {
    title: "Statistics, Development and Breakouts",
    summary: "CPU stat caps, attribute rewards, development upgrades, and exploit prevention.",
    icon: Sparkles,
    ruleTitles: [
      "🤖 Part 7 — CPU Games & Stat Caps",
      "📺 Part 6 — Streaming & Game of the Week",
      "🧠 Part 11 — Gameplay Conduct",
    ],
  },
  {
    title: "Playoffs",
    summary: "Playoff streaming rotation and playoff disconnect approvals.",
    icon: Trophy,
    ruleTitles: ["🏟️ Playoff Streaming Rotation:", "Playoff Disconnects"],
  },
  {
    title: "Penalties and Discipline",
    summary: "Strike system, suspensions, attribute reductions, removals, and documented review.",
    icon: AlertTriangle,
    ruleTitles: [
      "📖 Part 2 — No Quitting Policy",
      "🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules",
      "🤖 Part 7 — CPU Games & Stat Caps",
      "💰 Part 8 — Salary Cap & Trading Rules",
      "⚖️ Part 14 — League Enforcement (3-Strike System)",
    ],
  },
  {
    title: "Commissioner Authority",
    summary: "Commissioner review, enforcement, league recruiting, and final authority notes.",
    icon: Gavel,
    ruleTitles: [
      "⚖️ Part 14 — League Enforcement (3-Strike System)",
      "🤝 League Recruiting:",
      "⚡ Part 13-Disconnections",
      "League Standards",
    ],
  },
  {
    title: "FAQ",
    summary: "Fast answers to the most common owner questions.",
    icon: HelpCircle,
    ruleTitles: [
      "Where do owners communicate?",
      "When does the league advance?",
      "What happens if someone does not respond?",
      "Which games must be streamed?",
    ],
  },
  {
    title: "Version History",
    summary: "Rulebook version, last updated date, and future update log.",
    icon: FileText,
    ruleTitles: [],
  },
];

const suggestedQuestions = [
  "Can I go for it on fourth and four?",
  "Can I move a wide receiver to running back?",
  "What happens if someone quits?",
  "Who receives the fair win if neither player schedules?",
  "Do I have to stream a playoff game?",
  "Can I trade a player who demanded a trade?",
  "Can I ignore a holdout?",
  "Can I use void years?",
  "What is the stat cap for a quarterback?",
  "Can I no huddle every play?",
];

const searchBoosts = [
  { terms: ["quit", "quits", "dashboard", "concede"], title: "📖 Part 2 — No Quitting Policy" },
  { terms: ["fourth", "4th", "punt", "fourth down", "4th down"], title: "🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules" },
  { terms: ["two point", "2pt", "2 point", "conversion"], title: "🛡️ Part 12 — Defense, Goal Line, & 4th Down Rules" },
  { terms: ["wr to hb", "wide receiver to running back", "position", "substitution", "subs"], title: "🧩 Part 10 — Illegal Subs / Roster Rules / Editing" },
  { terms: ["trade", "cpu trade", "demanded trade", "trade demand"], title: "💰 Part 8 — Salary Cap & Trading Rules" },
  { terms: ["stream", "youtube", "twitch", "playoff game", "game of the week"], title: "📺 Part 6 — Streaming & Game of the Week" },
  { terms: ["stat padding", "stat pad", "quarterback cap", "qb cap", "cpu cap"], title: "🤖 Part 7 — CPU Games & Stat Caps" },
  { terms: ["holdout", "void years", "franchise tag", "transition tag", "restricted free agency", "guaranteed contract"], title: "Madden NFL 27 Review Required" },
  { terms: ["coach mode", "persona engine", "emergent actions", "no-trade", "no trade", "wear and tear", "free agent frenzy", "undrafted rookie"], title: "Madden NFL 27 Review Required" },
  { terms: ["dynamic weather", "weather"], title: "⚙️ Part 1 — League Setup & Schedule" },
  { terms: ["draft-day trades", "draft day trades", "cpu draft"], title: "💰 Part 8 — Salary Cap & Trading Rules" },
  { terms: ["force win", "fair win", "sim gods", "schedule", "respond"], title: "🕒 Scheduling & Sim Policy" },
  { terms: ["no huddle", "motion", "dropback", "qb drift"], title: "🧠 Part 11 — Gameplay Conduct" },
];

const stopWords = new Set(["a", "about", "am", "an", "and", "are", "can", "do", "does", "for", "happen", "happens", "how", "i", "if", "is", "it", "me", "my", "of", "on", "or", "the", "to", "use", "what", "when", "who"]);

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function cleanTitle(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getAllRules() {
  return rulebookCategories.flatMap((category) => category.rules.map((rule) => ({ ...rule, originalCategory: category.title })));
}

function findRule(title: string) {
  return getAllRules().find((rule) => cleanTitle(rule.title) === cleanTitle(title));
}

function buildDisplayCategories(): DisplayCategory[] {
  return categorySpecs.map((category) => ({
    title: category.title,
    summary: category.summary,
    icon: category.icon,
    rules: category.ruleTitles.reduce<RulebookRule[]>((rules, title) => {
      const rule = findRule(title);
      if (rule) rules.push(rule);
      return rules;
    }, []),
  }));
}

function getRulePreview(rule: RulebookRule) {
  return rule.content.find((line) => cleanTitle(line) !== cleanTitle(rule.title)) ?? rule.content[0] ?? rule.summary;
}

function getRuleLabels(rule: RulebookRule): Label[] {
  const text = [rule.title, rule.summary, ...rule.content].join(" ").toLowerCase();
  const labels: Label[] = [];
  if (/allowed|may attempt|may go|encouraged/.test(text)) labels.push("ALLOWED");
  if (/not tolerated|no quitting|no cutting|no cpu|no hiking|no backward|illegal|not allowed|must punt|excessive/.test(text)) labels.push("NOT ALLOWED");
  if (/must|required|mandatory|have to|all games|minimum|respond|communicate/.test(text)) labels.push("REQUIRED");
  if (/commissioner|commissioners|committee|approved|approval|review/.test(text)) labels.push("COMMISSIONER DECISION");
  if (/penalt|strike|suspension|removal|deduction|reduction|loss|demotion/.test(text)) labels.push("PENALTY");
  return Array.from(new Set(labels));
}

function getPenalty(rule: RulebookRule) {
  const penaltyLines = rule.content.filter((line) => /penalt|infraction|strike|suspension|removal|deduction|reduction|loss|demotion/i.test(line));
  return penaltyLines.length > 0 ? penaltyLines.slice(0, 4).join(" ") : null;
}

function scoreRule(query: string, category: string, rule: RulebookRule) {
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 1 && !stopWords.has(term));
  const text = [category, rule.title, rule.summary, ...rule.content].join(" ").toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (text.includes(term)) score += 1;
    if (rule.title.toLowerCase().includes(term)) score += 2;
  }

  for (const boost of searchBoosts) {
    if (boost.terms.some((term) => query.toLowerCase().includes(term))) {
      if (boost.title === rule.title) score += 8;
      if (boost.title === "Madden NFL 27 Review Required" && category === "What’s New in Madden 27") score += 6;
    }
  }

  return score;
}

function makeAnswer(rule: RulebookRule) {
  const preview = getRulePreview(rule);
  if (/not specifically covered/i.test(preview)) return unknownAnswer;
  return rule.summary || preview;
}

function makeMaddenReviewRules(): RulebookRule[] {
  return madden27ReviewTopics.map(([title, note]) => ({
    title,
    summary: note,
    content: [note],
  }));
}

function getSearchResults(query: string, categories: DisplayCategory[]) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const maddenCategory: DisplayCategory = {
    title: "What’s New in Madden 27",
    summary: "Commissioner-review items for new Madden 27 features.",
    icon: Sparkles,
    rules: makeMaddenReviewRules(),
  };

  return [...categories, maddenCategory]
    .flatMap((category) =>
      category.rules.map((rule) => ({
        category: category.title,
        rule,
        score: scoreRule(trimmed, category.title, rule),
        answer: makeAnswer(rule),
        penalty: getPenalty(rule),
      })),
    )
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function LabelPill({ label }: { label: Label }) {
  const styles: Record<Label, string> = {
    ALLOWED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    "NOT ALLOWED": "border-red-400/45 bg-red-500/10 text-red-200",
    REQUIRED: "border-electric/45 bg-electric/10 text-electric",
    "COMMISSIONER DECISION": "border-amber-300/45 bg-amber-300/10 text-amber-100",
    PENALTY: "border-white/35 bg-white/10 text-white",
  };

  return <span className={`rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${styles[label]}`}>{label}</span>;
}

function SearchInput({ id, query, onChange }: { id: string; query: string; onChange: (value: string) => void }) {
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-md border border-electric/35 bg-black/78 px-4 shadow-electric backdrop-blur-xl">
      <Search className="size-5 shrink-0 text-electric" />
      <label htmlFor={id} className="sr-only">Can I...?</label>
      <input
        id={id}
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Can I...?"
        className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-white outline-none placeholder:text-chrome-400"
      />
    </div>
  );
}

function LeagueLogo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="National Franchise League home">
      <Image
        src="/league-logo.png"
        alt="National Franchise League logo"
        width={88}
        height={120}
        className="h-16 w-auto object-contain drop-shadow-[0_0_22px_rgba(0,163,255,0.42)]"
        priority
      />
      <div className="leading-none">
        <p className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white md:text-2xl">National</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-chrome-300">Franchise League</p>
      </div>
    </Link>
  );
}

function RuleCard({ rule, number, categoryTitle, forceOpen }: { rule: RulebookRule; number: string; categoryTitle: string; forceOpen: boolean }) {
  const ruleId = slugify(`${categoryTitle}-${rule.title}`);
  const labels = getRuleLabels(rule);

  return (
    <details id={ruleId} className="group scroll-mt-32 rounded-md border border-white/10 bg-black/35 transition duration-300 open:border-electric/45 open:bg-black/62" open={forceOpen}>
      <summary className="flex min-h-24 cursor-pointer list-none items-start justify-between gap-3 p-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-electric">Rule {number}</p>
            {labels.map((label) => <LabelPill key={label} label={label} />)}
          </div>
          <h3 className="mt-3 break-words font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">
            {cleanTitle(rule.title)}
          </h3>
          <p className="mt-2 break-words text-sm leading-6 text-chrome-300">{rule.summary}</p>
        </div>
        <ChevronDown className="mt-1 size-5 shrink-0 text-electric transition duration-300 group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 px-4 pb-4">
        <p className="mt-4 rounded-md border border-electric/25 bg-electric/10 p-3 text-sm font-semibold leading-6 text-chrome-50">
          {getRulePreview(rule)}
        </p>
        <div className="mt-3 grid gap-2">
          {rule.content.map((line, index) => (
            <p key={`${line}-${index}`} className="break-words rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-7 text-chrome-100">
              {line}
            </p>
          ))}
        </div>
      </div>
    </details>
  );
}

function CategoryAccordion({ category, index, query }: { category: DisplayCategory; index: number; query: string }) {
  const Icon = category.icon;
  const categoryId = slugify(category.title);

  return (
    <article id={categoryId} className="scroll-mt-32">
      <details className="group rounded-md border border-white/12 bg-black/50 shadow-chrome backdrop-blur-xl" open={index < 2 || Boolean(query)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden md:p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-md border border-electric/45 bg-electric/10 text-electric">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-electric">Section {String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">{category.title}</h2>
              <p className="mt-2 text-sm leading-6 text-chrome-300">{category.summary}</p>
            </div>
          </div>
          <ChevronDown className="size-6 shrink-0 text-electric transition duration-300 group-open:rotate-180" />
        </summary>
        <div className="border-t border-white/10 px-3 pb-4 md:px-5 md:pb-5">
          {category.rules.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {category.rules.map((rule, ruleIndex) => (
                <RuleCard key={`${category.title}-${rule.title}`} rule={rule} number={`${index + 1}.${ruleIndex + 1}`} categoryTitle={category.title} forceOpen={Boolean(query)} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-chrome-300">
              Version entries are listed below in the Last Updated section.
            </div>
          )}
        </div>
      </details>
    </article>
  );
}

function SearchResults({ results, onOpen }: { results: SearchResult[]; onOpen: (id: string) => void }) {
  if (results.length === 0) return null;

  return (
    <section className="mt-4 grid gap-3">
      {results.map((result) => {
        const ruleId = slugify(`${result.category}-${result.rule.title}`);
        return (
          <article key={`${result.category}-${result.rule.title}`} className="rounded-md border border-electric/25 bg-black/72 p-4 shadow-electric">
            <div className="flex flex-wrap items-center gap-2">
              <LabelPill label={getRuleLabels(result.rule)[0] ?? "COMMISSIONER DECISION"} />
              <span className="rounded border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-chrome-300">{result.category}</span>
            </div>
            <h3 className="mt-3 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{cleanTitle(result.rule.title)}</h3>
            <p className="mt-2 text-sm font-bold text-electric">Short answer: {result.answer}</p>
            <p className="mt-2 text-sm leading-6 text-chrome-200">{getRulePreview(result.rule)}</p>
            {result.penalty ? <p className="mt-2 rounded-md border border-red-400/25 bg-red-500/10 p-3 text-sm leading-6 text-red-100">Penalty: {result.penalty}</p> : null}
            <Button type="button" variant="chrome" size="sm" className="mt-3" onClick={() => onOpen(ruleId)}>
              View Full Rule
            </Button>
          </article>
        );
      })}
    </section>
  );
}

function RulesAssistant({ categories }: { categories: DisplayCategory[] }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Ask a league-rule question. I only answer from the official rulebook stored in this website.",
    },
  ]);

  function answerQuestion(value: string) {
    const asked = value.trim();
    if (!asked) return;

    const [best] = getSearchResults(asked, categories);
    const response: ChatMessage = best
      ? {
          role: "assistant",
          text: best.answer === unknownAnswer ? unknownAnswer : `${best.answer} ${best.penalty ? `Penalty: ${best.penalty}` : ""}`.trim(),
          category: best.category,
          ruleTitle: cleanTitle(best.rule.title),
          ruleId: slugify(`${best.category}-${best.rule.title}`),
        }
      : {
          role: "assistant",
          text: unknownAnswer,
          category: "Commissioner Authority",
          ruleTitle: "No written rule found",
        };

    setMessages((current) => [...current, { role: "owner", text: asked }, response]);
    setQuestion("");
  }

  return (
    <section id="rules-assistant" className="scroll-mt-32 rounded-md border border-white/12 bg-black/72 p-4 shadow-chrome md:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-electric text-black shadow-electric">
          <Bot className="size-5" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-electric">No-API Rule Search</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">NFL Rules Assistant</h2>
          <p className="mt-2 text-sm leading-6 text-chrome-300">
            Answers come only from the embedded official rulebook. When the rulebook is silent, it sends owners to the commissioner.
          </p>
        </div>
      </div>

      <div className="mt-4 grid max-h-80 gap-3 overflow-y-auto rounded-md border border-white/10 bg-white/[0.04] p-3">
        {messages.map((message, index) => (
          <article key={`${message.role}-${index}`} className={`rounded-md p-3 ${message.role === "owner" ? "ml-8 bg-electric text-black" : "mr-8 border border-white/10 bg-black/70 text-chrome-100"}`}>
            <p className="text-sm font-semibold leading-6">{message.text}</p>
            {message.role === "assistant" && message.ruleTitle ? (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-electric">{message.category}</p>
                <p className="mt-1 text-xs text-chrome-300">{message.ruleTitle}</p>
                {message.ruleId ? (
                  <Button asChild variant="chrome" size="sm" className="mt-3">
                    <Link href={`#${message.ruleId}`}>View Full Rule</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") answerQuestion(question);
          }}
          placeholder="Ask about fourth down, trades, streaming..."
          className="min-h-12 min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none placeholder:text-chrome-500"
        />
        <Button type="button" variant="electric" size="icon" aria-label="Ask NFL Rules Assistant" onClick={() => answerQuestion(question)}>
          <Send className="size-5" />
        </Button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {suggestedQuestions.map((item) => (
          <button key={item} type="button" onClick={() => answerQuestion(item)} className="min-h-10 shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-3 text-left text-xs font-bold text-chrome-200">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

export function RulesRulebook() {
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const displayCategories = useMemo(() => buildDisplayCategories(), []);
  const searchResults = useMemo(() => getSearchResults(query, displayCategories), [query, displayCategories]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return displayCategories;

    return displayCategories
      .map((category) => {
        const categoryMatches = [category.title, category.summary].some((value) => value.toLowerCase().includes(normalizedQuery));
        return {
          ...category,
          rules: categoryMatches
            ? category.rules
            : category.rules.filter((rule) =>
                [rule.title, rule.summary, ...rule.content].some((value) => value.toLowerCase().includes(normalizedQuery)),
              ),
        };
      })
      .filter((category) => category.rules.length > 0 || category.title === "Version History");
  }, [displayCategories, normalizedQuery]);

  const totalRules = displayCategories.reduce((total, category) => total + category.rules.length, 0);
  const visibleRules = filteredCategories.reduce((total, category) => total + category.rules.length, 0);

  function openRule(id: string) {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    element?.setAttribute("open", "");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8">
          <LeagueLogo />
          <div className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200 xl:flex">
            {navItems.map((item) => (
              <Link href={item === "Home" ? "/" : `/${item.toLowerCase().replaceAll(" ", "-")}`} key={item} className="transition hover:text-white">
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

      <section className="relative overflow-hidden pt-24">
        <Image src="/stadium-hero.png" alt="Football stadium lights" fill priority className="object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.94)_76%,#05070a_100%)]" />
        <div className="absolute inset-0 grid-fade opacity-25" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-electric/40 bg-electric/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-electric">
              <BookOpen className="size-4" />
              {rulebookMeta.version}
            </p>
            <h1 className="mt-5 chrome-text font-[var(--font-oswald)] text-4xl font-bold uppercase leading-[0.92] md:text-7xl">
              {rulebookMeta.edition}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-chrome-200 md:text-xl">
              A simpler, mobile-first owner guide backed by the full embedded official rulebook.
            </p>
          </div>
        </div>
      </section>

      <section id="orientation" className="border-y border-white/10 bg-[linear-gradient(180deg,#05070a,#0b0e12)] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-electric">Estimated reading time: 2 minutes</p>
              <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">New Owner Orientation</h2>
              <p className="mt-2 text-lg font-bold text-chrome-200">The 10 Rules Every Owner Must Know</p>
            </div>
            <Button asChild variant="electric" size="lg">
              <Link href="#full-rulebook">View Full Official Rulebook</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {rookieOrientation.map((item) => (
              <article key={item.title} className="rounded-md border border-white/10 bg-black/48 p-4 shadow-chrome">
                <LabelPill label={item.label as Label} />
                <h3 className="mt-3 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-chrome-300">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="league-basics" className="bg-black py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-white md:text-5xl">League Basics</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-9">
            {leagueBasics.map(([label, value]) => (
              <article key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-chrome-400">{label}</p>
                <p className="mt-2 text-sm font-bold leading-5 text-white">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="full-rulebook" className="relative bg-[linear-gradient(180deg,#05070a_0%,#0b0e12_44%,#05070a_100%)] py-8 md:py-12">
        <div className="absolute inset-0 grid-fade opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="sticky top-20 z-40 mb-5 rounded-md border border-white/12 bg-black/92 p-3 shadow-chrome backdrop-blur-2xl lg:hidden">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <SearchInput id="mobile-rule-search" query={query} onChange={setQuery} />
              </div>
              <Button type="button" variant="chrome" size="icon" aria-label="Toggle rulebook navigation" onClick={() => setMobileNavOpen((open) => !open)}>
                {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
            <SearchResults results={searchResults} onOpen={openRule} />
            {mobileNavOpen ? (
              <div className="mt-3 grid max-h-[38vh] gap-2 overflow-y-auto pr-1">
                {displayCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link key={category.title} href={`#${slugify(category.title)}`} onClick={() => setMobileNavOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 text-xs font-bold uppercase tracking-[0.1em] text-chrome-200">
                      <Icon className="size-4 text-electric" />
                      {category.title}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <aside className="sticky top-24 hidden rounded-md border border-white/12 bg-black/82 p-4 shadow-chrome backdrop-blur-2xl lg:block">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-electric">
                <Search className="size-4" />
                Can I...?
              </p>
              <div className="mt-3">
                <SearchInput id="desktop-rule-search" query={query} onChange={setQuery} />
              </div>
              <SearchResults results={searchResults} onOpen={openRule} />
              <nav className="mt-4 grid max-h-[44vh] gap-2 overflow-y-auto pr-1">
                {displayCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link key={category.title} href={`#${slugify(category.title)}`} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-bold uppercase tracking-[0.1em] text-chrome-300 transition hover:border-electric/55 hover:text-white">
                      <Icon className="size-4 text-electric" />
                      {category.title}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-electric">
                    <FileText className="size-4" />
                    Full Official Rulebook
                  </p>
                  <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">Complete Rules</h2>
                </div>
                <p className="rounded-md border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-chrome-200">
                  {visibleRules} of {totalRules} cards
                </p>
              </div>

              <div className="grid gap-4">
                {filteredCategories.map((category) => {
                  const originalIndex = displayCategories.findIndex((item) => item.title === category.title);
                  return <CategoryAccordion key={category.title} category={category} index={originalIndex} query={normalizedQuery} />;
                })}
              </div>

              <section id="madden-27" className="mt-6 scroll-mt-32 rounded-md border border-white/12 bg-black/62 p-4 shadow-chrome md:p-6">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-electric">
                  <Sparkles className="size-4" />
                  What&apos;s New in Madden 27
                </p>
                <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">Commissioner Review Board</h2>
                <p className="mt-2 text-sm leading-6 text-chrome-300">
                  These items are shown for review. They do not change official gameplay, scheduling, streaming, trade, quitting, fourth-down, two-point, stat-cap, or illegal-position rules unless approved.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {madden27ReviewTopics.map(([title, note]) => (
                    <article key={title} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                      <LabelPill label={/not specifically covered/i.test(note) ? "COMMISSIONER DECISION" : "REQUIRED"} />
                      <h3 className="mt-3 font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-chrome-300">{note}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="last-updated" className="mt-6 scroll-mt-32 rounded-md border border-white/12 bg-black/62 p-4 shadow-chrome md:p-6">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-electric">
                  <CalendarDays className="size-4" />
                  Last Updated
                </p>
                <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">Version History</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {rulebookQuickStats.map(([label, value]) => (
                    <article key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-chrome-400">{label}</p>
                      <p className="mt-2 font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{value}</p>
                    </article>
                  ))}
                  {whatsNew.map((entry) => (
                    <article key={entry.title} className="rounded-md border border-white/10 bg-white/[0.045] p-4 md:col-span-3">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-electric">{entry.date}</p>
                      <h3 className="mt-2 font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{entry.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-chrome-300">{entry.note}</p>
                    </article>
                  ))}
                  <article className="rounded-md border border-electric/25 bg-electric/10 p-4 md:col-span-3">
                    <p className="text-sm leading-6 text-chrome-100">
                      Imported source statements tracked in the embedded rulebook: {originalNotionStatements.length}. User-facing Notion links and Notion app dependencies are not used.
                    </p>
                  </article>
                </div>
              </section>

              <div className="mt-6">
                <RulesAssistant categories={displayCategories} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
