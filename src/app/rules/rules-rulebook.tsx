"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileText,
  Home,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  newOwnerGuide,
  rulebookCategories,
  rulebookMeta,
  rulebookQuickStats,
  whatsNew,
} from "./rulebook-data";
import type { RulebookCategory, RulebookRule } from "./rulebook-data";

const navItems = ["Home", "Rules", "Teams", "Standings", "Schedule", "Stats", "News", "Media", "Hall of Fame", "Commissioner"];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getRulePreview(rule: RulebookRule) {
  return rule.content.find((line) => line !== rule.title) ?? rule.content[0] ?? rule.summary;
}

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

function RuleCard({ rule, number, forceOpen }: { rule: RulebookRule; number: string; forceOpen: boolean }) {
  return (
    <details className="group min-w-0 max-w-full rounded-md border border-white/10 bg-black/35 transition duration-300 open:border-electric/45 open:bg-black/60" open={forceOpen}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 marker:hidden md:p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-electric">Rule {number}</p>
          <h3 className="mt-2 break-words font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">
            {rule.title}
          </h3>
          <p className="mt-2 break-words text-sm leading-6 text-chrome-300">{rule.summary}</p>
          <p className="mt-3 break-words text-sm leading-6 text-chrome-400">{getRulePreview(rule)}</p>
        </div>
        <ChevronDown className="mt-1 size-5 shrink-0 text-electric transition duration-300 group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 px-4 pb-4 md:px-5 md:pb-5">
        <div className="mt-4 grid gap-2">
          {rule.content.map((line, index) => (
            <p key={`${line}-${index}`} className="break-words rounded-md border border-white/10 bg-white/[0.04] p-3 leading-7 text-chrome-50">
              {line}
            </p>
          ))}
        </div>
      </div>
    </details>
  );
}

function CategoryAccordion({ category, index, query }: { category: RulebookCategory; index: number; query: string }) {
  const Icon = category.icon;
  const categoryId = slugify(category.title);

  return (
    <article id={categoryId} className="min-w-0 max-w-full scroll-mt-32">
      <details className="group premium-card interactive-card min-w-0 max-w-full rounded-md border border-white/12 backdrop-blur-xl" open={index === 0 || Boolean(query)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden md:p-6 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-md border border-electric/45 bg-electric/10 text-electric shadow-electric">
              <Icon className="size-6" />
            </span>
            <div className="min-w-0 max-w-full">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Category {String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white md:text-4xl">
                {category.title}
              </h2>
              <p className="mt-2 break-words text-sm leading-6 text-chrome-300 md:text-base">{category.summary}</p>
            </div>
          </div>
          <ChevronDown className="size-6 shrink-0 text-electric transition duration-300 group-open:rotate-180" />
        </summary>
        <div className="border-t border-white/10 px-4 pb-5 md:px-6 md:pb-6">
          <div className="mt-5 grid gap-3">
            {category.rules.map((rule, ruleIndex) => (
              <RuleCard key={rule.title} rule={rule} number={`${index + 1}.${ruleIndex + 1}`} forceOpen={Boolean(query)} />
            ))}
          </div>
        </div>
      </details>
    </article>
  );
}

function SearchInput({ id, query, onChange }: { id: string; query: string; onChange: (value: string) => void }) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3">
      <Search className="size-5 shrink-0 text-electric" />
      <label htmlFor={id} className="sr-only">Search rulebook</label>
      <input
        id={id}
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search rulebook"
        className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-chrome-400 lg:text-sm"
      />
    </div>
  );
}

export function RulesRulebook() {
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return rulebookCategories;

    return rulebookCategories
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
      .filter((category) => category.rules.length > 0);
  }, [normalizedQuery]);

  const totalRules = rulebookCategories.reduce((total, category) => total + category.rules.length, 0);
  const visibleRules = filteredCategories.reduce((total, category) => total + category.rules.length, 0);
  const totalStatements = rulebookCategories.reduce((total, category) => total + category.rules.reduce((sum, rule) => sum + rule.content.length, 0), 0);

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
        <div className="absolute inset-0 grid-fade opacity-30" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-electric shadow-electric">
                <BookOpen className="size-4" />
                Official Digital Rulebook
              </span>
              <span className="rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome-200 backdrop-blur">
                {rulebookMeta.version}
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
              Realistic Competition. Integrity. Flexibility for Busy Players.
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-chrome-300">
              The official home for National Franchise League rules, gameplay standards, owner conduct, streaming requirements, and commissioner enforcement.
            </p>
          </div>

          <aside className="premium-card rounded-md border border-white/12 p-5 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <ShieldCheck className="size-4" />
              Rulebook Snapshot
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {rulebookQuickStats.map(([label, value]) => (
                <div key={label} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">{label}</p>
                  <p className="mt-2 break-words font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-md border border-electric/35 bg-electric/10 p-3 text-sm leading-6 text-chrome-100">
              {rulebookMeta.sourceStatus}
            </p>
          </aside>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-[linear-gradient(180deg,#05070a_0%,#0b0e12_48%,#05070a_100%)] py-10 md:py-16">
        <div className="absolute inset-0 grid-fade opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                  <Sparkles className="size-4" />
                  New Owner Guide
                </p>
                <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">
                  Read This First
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-chrome-300">
                  A quick 3-5 minute orientation before the full competition rulebook.
                </p>
              </div>
              <p className="rounded-md border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-chrome-200">
                {totalStatements} imported statements
              </p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {newOwnerGuide.map((item, index) => (
                <article key={item.title} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">Step {index + 1}</p>
                  <h3 className="mt-3 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-chrome-300">{item.body}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,#05070a_0%,#0b0e12_48%,#05070a_100%)] py-10 md:py-16">
        <div className="absolute inset-0 grid-fade opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="sticky top-24 z-30 mb-6 rounded-md border border-white/12 bg-black/90 p-3 shadow-chrome backdrop-blur-2xl lg:hidden">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <SearchInput id="mobile-rule-search" query={query} onChange={setQuery} />
              </div>
              <Button type="button" variant="chrome" size="icon" aria-label="Toggle rulebook navigation" onClick={() => setMobileNavOpen((open) => !open)}>
                {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
            {mobileNavOpen ? (
              <div className="mt-3 grid max-h-[42vh] gap-2 overflow-y-auto pr-1 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
                {rulebookCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.title}
                      href={`#${slugify(category.title)}`}
                      onClick={() => setMobileNavOpen(false)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 text-xs font-bold uppercase tracking-[0.12em] text-chrome-200"
                    >
                      <Icon className="size-4 text-electric" />
                      {category.title}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[290px_1fr] lg:items-start">
            <aside className="sticky top-28 hidden rounded-md border border-white/12 bg-black/80 p-4 shadow-chrome backdrop-blur-2xl lg:block">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                <FileText className="size-4" />
                Rulebook Index
              </p>
              <div className="mt-4">
                <SearchInput id="desktop-rule-search" query={query} onChange={setQuery} />
              </div>
              <nav className="mt-4 grid max-h-[58vh] gap-2 overflow-y-auto pr-1 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
                {rulebookCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link key={category.title} href={`#${slugify(category.title)}`} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-bold uppercase tracking-[0.12em] text-chrome-300 transition hover:border-electric/55 hover:text-white">
                      <Icon className="size-4 text-electric" />
                      {category.title}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                    <FileText className="size-4" />
                    Competition Rulebook
                  </p>
                  <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white md:text-6xl">
                    Full Rulebook
                  </h2>
                </div>
                <p className="rounded-md border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-chrome-200">
                  {visibleRules} of {totalRules} cards
                </p>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="grid gap-4">
                  {filteredCategories.map((category) => {
                    const originalIndex = rulebookCategories.findIndex((item) => item.title === category.title);
                    return <CategoryAccordion key={category.title} category={category} index={originalIndex} query={normalizedQuery} />;
                  })}
                </div>
              ) : (
                <div className="rounded-md border border-white/12 bg-black/45 p-8 text-center">
                  <Search className="mx-auto size-8 text-electric" />
                  <h2 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">No Rules Found</h2>
                  <p className="mt-2 text-chrome-300">Try a different search term.</p>
                </div>
              )}

              <section id="last-updated" className="mt-8 scroll-mt-32 rounded-md border border-white/12 bg-black/55 p-5 shadow-chrome backdrop-blur-xl md:p-6">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                  <CalendarDays className="size-4" />
                  Last Updated
                </p>
                <h2 className="mt-3 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Version History</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <article className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{rulebookMeta.version}</h3>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-electric">{rulebookMeta.lastUpdated}</p>
                    <p className="mt-2 text-sm leading-6 text-chrome-300">{rulebookMeta.sourceStatus}</p>
                  </article>
                  <article className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white">Official Home</h3>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-electric">National Franchise League Website</p>
                    <p className="mt-2 text-sm leading-6 text-chrome-300">No user-facing Notion links or Notion application dependency remain in the rulebook experience.</p>
                  </article>
                </div>
              </section>

              <section id="whats-new" className="mt-6 scroll-mt-32 rounded-md border border-white/12 bg-black/55 p-5 shadow-chrome backdrop-blur-xl md:p-6">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                  <Sparkles className="size-4" />
                  What's New
                </p>
                <div className="mt-5 grid gap-3">
                  {whatsNew.map((entry) => (
                    <article key={entry.title} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{entry.title}</h3>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-electric">{entry.date}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-chrome-300">{entry.note}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
