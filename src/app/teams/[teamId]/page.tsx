import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, Star, Trophy } from "lucide-react";

import { getTeamProfile } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function TeamProfilePage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const profile = getTeamProfile(teamId);
  if (!profile) notFound();

  const record = profile.standing ? `${profile.standing.wins}-${profile.standing.losses}` : "0-0";

  return (
    <main className="min-h-screen bg-black px-5 pb-12 pt-32 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric"><Shield className="size-4" /> Team Profile</p>
        <h1 className="mt-3 font-[var(--font-oswald)] text-6xl font-bold uppercase text-white">{profile.team.fullName}</h1>
        <p className="mt-3 text-xl text-chrome-300">Owner: {profile.owner?.name ?? "Open team"}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="premium-card rounded-md border border-white/12 p-5"><Trophy className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Record</p><p className="mt-1 text-2xl font-bold text-white">{record}</p></div>
          <div className="premium-card rounded-md border border-white/12 p-5"><Star className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Leaders</p><p className="mt-1 text-2xl font-bold text-white">{profile.stats.length}</p></div>
          <div className="premium-card rounded-md border border-white/12 p-5"><Shield className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Games</p><p className="mt-1 text-2xl font-bold text-white">{profile.games.length}</p></div>
        </div>
        <div className="mt-8 premium-card rounded-md border border-white/12 p-5">
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase">Player Stats</h2>
          <div className="mt-4 grid gap-3">
            {profile.stats.map((stat) => <div key={stat.id} className="rounded-md border border-white/10 bg-black/35 p-3">{stat.category}: {stat.playerName} | {stat.value} {stat.extra}</div>)}
          </div>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white">Back to League Home</Link>
      </section>
    </main>
  );
}
