import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, UserRound, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTeamsDirectoryData, ownerStatusLabel } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Teams | National Franchise League",
  description: "All 32 National Franchise League teams, ownership status, owner names, and gamertags.",
};

export const dynamic = "force-dynamic";

export default function TeamsPage() {
  const teams = getTeamsDirectoryData();
  const claimed = teams.filter((entry) => entry.owner).length;

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League teams" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.68),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Shield className="size-4" />
            Team Directory
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">All 32 NFL Teams</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Claim status, owner names, and gamertags for every National Franchise League franchise.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Teams</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{teams.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Claimed</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{claimed}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Available</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{teams.length - claimed}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {teams.map(({ team, owner, profileSlug, ownerName, gamertag }) => (
            <article key={team.id} className="rounded-md border border-white/12 bg-white/[0.045] p-4 shadow-chrome">
              <div className="flex items-start gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-md border border-white/15 bg-black/45">
                  <Image src={team.logoSrc} alt={`${team.fullName} logo`} width={56} height={56} className="max-h-12 w-auto object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-electric">
                    {owner ? ownerStatusLabel(owner.status, owner.role) : "Available"}
                  </p>
                  <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{team.fullName}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-chrome-300">
                    <UserRound className="size-4 text-electric" />
                    {ownerName}
                  </p>
                  <p className="text-sm text-chrome-400">{gamertag}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Button asChild variant={owner ? "chrome" : "electric"} className="w-full">
                  <Link href={owner ? `/owners/${profileSlug}` : "/apply"}>
                    <Users className="size-4" />
                    {owner ? "View Owner" : "Apply for Team"}
                  </Link>
                </Button>
                <Button asChild variant="chrome" className="w-full">
                  <Link href={`/teams/${team.id}`}>Team Page</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
