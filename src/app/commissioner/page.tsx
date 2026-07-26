export const runtime = "edge";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CalendarDays, Scale, ShieldCheck, Trophy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCommissionerSession } from "@/lib/auth/session";
import { getCommissionerDashboardData } from "@/lib/db/repositories";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="premium-card rounded-md border border-white/12 p-4 shadow-chrome backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{label}</p>
      <p className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase text-white">{value}</p>
    </div>
  );
}

export default async function CommissionerDashboardPage() {
  const session = await getCommissionerSession();
  if (!session) redirect("/commissioner/login");

  const data = getCommissionerDashboardData();

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <ShieldCheck className="size-4" />
              Secure Control Room
            </p>
            <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase text-white md:text-7xl">Commissioner Dashboard</h1>
            <p className="mt-3 max-w-3xl text-chrome-300">Manage the National Franchise League’s Madden PS5 operations from one protected broadcast desk.</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="chrome" size="lg">Sign Out</Button>
          </form>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Owners" value={data.owners.length} />
          <StatCard label="Games" value={data.games.length} />
          <StatCard label="Pending Trades" value={data.pendingTrades.length} />
          <StatCard label="Rule Sections" value={data.rules.length} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><Scale className="text-electric" /> Trade Queue</h2>
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {data.pendingTrades.map((trade) => (
                <div key={trade.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{trade.status}</p>
                  <p className="mt-2 text-chrome-100">{trade.summary}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><Bell className="text-electric" /> Announcements</h2>
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {data.announcements.map((item) => (
                <div key={item.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{item.title}</p>
                  <p className="mt-2 text-chrome-100">{item.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><Users className="text-electric" /> Owners</h2>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {data.owners.map((owner) => (
                <Link key={owner.id} href={`/owners/${owner.id}`} className="block rounded-md border border-white/10 bg-black/35 p-3 transition hover:border-electric/60 hover:text-white">
                  <span className="font-bold text-white">{owner.name}</span>
                  <span className="ml-2 text-sm text-chrome-300">{owner.gamertag}</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><CalendarDays className="text-electric" /> Schedule Ops</h2>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {data.games.map((game) => (
                <div key={game.id} className="rounded-md border border-white/10 bg-black/35 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">Week {game.week} | {game.status}</p>
                  <p className="mt-1 text-chrome-100">{game.awayTeamId.toUpperCase()} at {game.homeTeamId.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white">
          <Trophy className="size-4" />
          Return to League Hub
        </Link>
      </div>
    </main>
  );
}
