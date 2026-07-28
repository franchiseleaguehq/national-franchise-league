import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Radio, Shield, Trophy, UserRound, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOwnerDirectory, getUnassignedOwnerProfiles, ownerStatusLabel } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Owner Portal | National Franchise League",
  description: "National Franchise League owner directory, open teams, and owner profiles.",
};

export const dynamic = "force-dynamic";

function TeamMark({ abbreviation, primaryColor, secondaryColor }: { abbreviation: string; primaryColor: string; secondaryColor: string }) {
  return (
    <div
      className="grid size-16 shrink-0 place-items-center rounded-md border border-white/15 font-[var(--font-oswald)] text-2xl font-bold text-white shadow-electric"
      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
    >
      {abbreviation}
    </div>
  );
}

export default function OwnersPage() {
  const directory = getOwnerDirectory();
  const unassignedOwners = getUnassignedOwnerProfiles();
  const openTeams = directory.filter((entry) => !entry.owner);
  const activeProfileCount = directory.filter((entry) => entry.owner).length + unassignedOwners.length;

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League owner portal" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.68),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Users className="size-4" />
            Owner Portal
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Owners</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            All 32 teams in one mobile-friendly directory, ready for commissioner-assigned owner profiles, streaming links, and achievement badges.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Teams</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{directory.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Active Profiles</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{activeProfileCount}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Open Teams</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{openTeams.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="open-teams" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 md:px-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <Shield className="size-4" />
              Team Grid
            </p>
            <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">All 32 Teams</h2>
          </div>
          <Button asChild variant="electric" size="lg">
            <Link href="/apply">Apply to Join</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {directory.map(({ team, owner, achievements, profileSlug }) => {
            const isOpen = !owner;
            const preferredPlatform = owner?.preferredPlatform ?? "None";
            const streamingHref = owner?.youtubeUrl ?? (owner?.twitchChannel ? `https://www.twitch.tv/${owner.twitchChannel}` : owner?.kickUrl);

            return (
              <article key={team.id} className="rounded-md border border-white/12 bg-white/[0.045] p-4 shadow-chrome">
                <div className="flex items-start gap-4">
                  <TeamMark abbreviation={team.abbreviation} primaryColor={team.primaryColor} secondaryColor={team.secondaryColor} />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-electric">{ownerStatusLabel(owner?.status, owner?.role)}</p>
                    <h3 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{team.fullName}</h3>
                    <p className="mt-2 text-sm font-semibold text-chrome-300">{owner?.name ?? "Open Team"}</p>
                    <p className="text-sm text-chrome-400">{owner?.gamertag ?? "Available for lottery"}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-black/35 p-3">
                  <Image
                    src={owner?.avatarSrc ?? "/league-logo.png"}
                    alt={owner ? `${owner.name} profile avatar` : "Default National Franchise League avatar"}
                    width={52}
                    height={52}
                    className="size-12 rounded-md object-contain"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Profile</p>
                    <p className="truncate text-sm font-bold text-white">{owner?.name ?? "No owner assigned"}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="flex items-center justify-between rounded-md border border-white/10 bg-black/35 px-3 py-2 text-sm">
                    <span className="text-chrome-400">Broadcast</span>
                    <span className="font-bold text-white">{preferredPlatform}</span>
                  </div>
                  {streamingHref ? (
                    <Link href={streamingHref} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-bold text-chrome-200 transition hover:border-electric/55 hover:text-white">
                      <Radio className="size-4" />
                      Open Channel
                    </Link>
                  ) : null}
                </div>

                {achievements.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {achievements.slice(0, 3).map((achievement) => (
                      <span key={achievement.id} className="rounded border border-electric/30 bg-electric/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-electric">
                        {achievement.label}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-2">
                  <Button asChild variant={isOpen ? "electric" : "chrome"} className="w-full">
                    <Link href={isOpen ? "/apply" : `/owners/${profileSlug}`}>
                      {isOpen ? "Apply to Join Lottery" : "View Profile"}
                    </Link>
                  </Button>
                  <Button asChild variant="chrome" className="w-full">
                    <Link href={`/teams/${team.id}`}>
                      <Trophy className="size-4" />
                      Team Page
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {unassignedOwners.length > 0 ? (
          <section className="mt-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <UserRound className="size-4" />
              Unassigned Profiles
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {unassignedOwners.map((owner) => (
                <article key={owner.id} className="rounded-md border border-electric/30 bg-electric/10 p-4 shadow-chrome">
                  <div className="flex items-center gap-3">
                    <Image
                      src={owner.avatarSrc ?? "/league-logo.png"}
                      alt={`${owner.name} profile avatar`}
                      width={56}
                      height={56}
                      className="size-14 rounded-md object-contain"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-electric">{ownerStatusLabel(owner.status, owner.role)}</p>
                      <h3 className="truncate font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{owner.name}</h3>
                      <p className="truncate text-sm text-chrome-300">{owner.gamertag}</p>
                    </div>
                  </div>
                  <Button asChild variant="chrome" className="mt-4 w-full">
                    <Link href={`/owners/${owner.slug}`}>View Profile</Link>
                  </Button>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
