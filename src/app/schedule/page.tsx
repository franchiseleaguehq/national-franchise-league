import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Edit3, Shield, Trophy } from "lucide-react";

import { getScheduleData } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Schedule | National Franchise League",
  description: "Official 2026 NFL regular-season schedule for the National Franchise League Madden season.",
};

export const dynamic = "force-dynamic";

const statuses = ["Unscheduled", "Scheduled", "Final", "Force Win", "Sim"];

export default function SchedulePage() {
  const { weeks } = getScheduleData();
  const gameCount = weeks.reduce((count, week) => count + week.games.length, 0);

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League schedule" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.70),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <CalendarDays className="size-4" />
            Official 2026 NFL Schedule
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Schedule</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Weeks 1-18 use the official NFL regular-season matchups. Madden status and scores are ready for Commissioner updates.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Weeks</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">18</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Matchups</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{gameCount}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Madden Status</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">Editable</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="sticky top-0 z-30 -mx-4 mb-6 overflow-x-auto border-y border-white/10 bg-black/88 px-4 py-3 backdrop-blur-xl md:top-0 md:mx-0 md:rounded-md md:border">
          <div className="flex gap-2">
            {weeks.map((week) => (
              <Link key={week.week} href={`#week-${week.week}`} className="shrink-0 rounded-md border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-chrome-200 transition hover:border-electric/55 hover:text-white">
                Week {week.week}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-7">
          {weeks.map((week) => (
            <section key={week.week} id={`week-${week.week}`} className="scroll-mt-28">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                    <Shield className="size-4" />
                    Regular Season
                  </p>
                  <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Week {week.week}</h2>
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-chrome-300">
                  {week.games.length} games
                </span>
              </div>

              <div className="grid gap-3 xl:grid-cols-2">
                {week.games.map((game) => (
                  <article key={game.id} className="rounded-md border border-white/12 bg-white/[0.045] p-4 shadow-chrome">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">
                          {game.nflScheduleLabel ?? "TBD"} | {game.kickoffTime ?? "TBD"} | {game.network ?? "TBD"}
                        </p>
                        <h3 className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">
                          {game.awayTeam?.fullName} at {game.homeTeam?.fullName}
                        </h3>
                      </div>
                      <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-electric/35 bg-electric/10 px-3 text-xs font-black uppercase tracking-[0.14em] text-electric">
                        {game.statusLabel}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-white/10 bg-black/35 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Away Owner</p>
                        <p className="mt-1 font-bold text-white">{game.awayOwner?.name ?? "Available"}</p>
                        <p className="text-sm text-chrome-400">{game.awayOwner?.gamertag ?? "Available"}</p>
                      </div>
                      <div className="rounded-md border border-white/10 bg-black/35 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Home Owner</p>
                        <p className="mt-1 font-bold text-white">{game.homeOwner?.name ?? "Available"}</p>
                        <p className="text-sm text-chrome-400">{game.homeOwner?.gamertag ?? "Available"}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                          Status
                          <select defaultValue={game.statusLabel} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric">
                            {statuses.map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                          Away Score
                          <input type="number" min="0" defaultValue={game.awayScore ?? ""} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric" />
                        </label>
                        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                          Home Score
                          <input type="number" min="0" defaultValue={game.homeScore ?? ""} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric" />
                        </label>
                      </div>
                      <p className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 text-xs font-bold uppercase tracking-[0.12em] text-chrome-300">
                        <Edit3 className="size-4 text-electric" />
                        Commissioner editable
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
