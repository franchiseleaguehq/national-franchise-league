import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, Star, Trophy } from "lucide-react";

import { getHomeData } from "@/lib/db/repositories";
import { getLeagueResults } from "@/lib/db/league-results";

export const metadata: Metadata = {
  title: "Stats | National Franchise League",
  description: "National Franchise League Madden stats and future standings.",
};

export const dynamic = "force-dynamic";

export default function StatsPage() {
  const data = getHomeData();
  const results = getLeagueResults();

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League stats" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.70),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <BarChart3 className="size-4" />
            Stats Desk
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Stats</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Player leaders are staged here. Standings will return once official Madden league results are available.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[1fr_0.8fr]">
        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Star className="size-4" />
            League Leaders
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {data.leaders.map(([category, player, team, stat, extra]) => (
              <div key={category} className="rounded-md border border-white/10 bg-black/35 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{category}</p>
                <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{player}</h2>
                <p className="mt-1 text-sm text-chrome-300">{team}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-chrome-300">{stat} | {extra}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-electric/25 bg-electric/10 p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Trophy className="size-4" />
            {results ? `Standings — ${results.week}` : "Standings Temporarily Hidden"}
          </p>
          {results ? (
            <>
              <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">League Standings</h2>
              <div className="mt-5 overflow-hidden rounded-md border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black/40 text-left text-xs uppercase tracking-[0.18em] text-chrome-300">
                      <th className="px-4 py-3">Team</th>
                      <th className="px-4 py-3 text-center">W</th>
                      <th className="px-4 py-3 text-center">L</th>
                      <th className="px-4 py-3 text-center">T</th>
                      <th className="px-4 py-3 text-center">PF</th>
                      <th className="px-4 py-3 text-center">PA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.standings.map((row) => (
                      <tr key={row.abbr} className="border-t border-white/10 text-chrome-100">
                        <td className="px-4 py-2.5 font-bold uppercase text-white">
                          {row.team} <span className="text-chrome-400">({row.abbr})</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">{row.wins}</td>
                        <td className="px-4 py-2.5 text-center">{row.losses}</td>
                        <td className="px-4 py-2.5 text-center">{row.ties}</td>
                        <td className="px-4 py-2.5 text-center">{row.pointsFor}</td>
                        <td className="px-4 py-2.5 text-center">{row.pointsAgainst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-chrome-400">
                Updated {new Date(results.updatedAt).toLocaleString()} · {results.season}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Awaiting League Results</h2>
              <p className="mt-3 text-sm leading-6 text-chrome-200">
                Standings are intentionally hidden until real National Franchise League Madden results are entered.
              </p>
            </>
          )}
        </article>
      </section>

      {results && results.recentGames.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase">Recent Finals</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {results.recentGames.map((game, idx) => (
              <div key={idx} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{game.week}</p>
                <p className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">
                  {game.awayTeam} {game.awayScore} <span className="text-chrome-400">@</span> {game.homeScore} {game.homeTeam}
                </p>
                {game.recap && <p className="mt-2 text-sm leading-6 text-chrome-200">{game.recap}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
