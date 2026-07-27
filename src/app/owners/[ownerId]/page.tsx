import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, CalendarDays, Clock, Gamepad2, Radio, Shield, Trophy, UserRound, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOwnerPortalProfile, getOwnerProfile, getOwnerStats, listOwnerProfileSlugs, ownerStatusLabel } from "@/lib/db/repositories";
import type { LucideIcon } from "lucide-react";

type StreamingLink = [label: string, href: string, Icon: LucideIcon];

export function generateStaticParams() {
  return listOwnerProfileSlugs().map((ownerId) => ({ ownerId }));
}

export async function generateMetadata({ params }: { params: Promise<{ ownerId: string }> }): Promise<Metadata> {
  const { ownerId } = await params;
  const profile = getOwnerPortalProfile(ownerId);
  if (!profile) return {};

  return {
    title: `${profile.owner?.name ?? "Open Team"} | ${profile.team.fullName}`,
    description: `${profile.team.fullName} owner profile for the National Franchise League.`,
  };
}

function TeamMark({ abbreviation, primaryColor, secondaryColor }: { abbreviation: string; primaryColor: string; secondaryColor: string }) {
  return (
    <div
      className="grid size-24 shrink-0 place-items-center rounded-md border border-white/15 font-[var(--font-oswald)] text-4xl font-bold text-white shadow-electric"
      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
    >
      {abbreviation}
    </div>
  );
}

export default async function OwnerProfilePage({ params }: { params: Promise<{ ownerId: string }> }) {
  const { ownerId } = await params;
  const profile = getOwnerPortalProfile(ownerId);
  if (!profile) notFound();

  const { team, owner, achievements } = profile;
  const permanentProfile = owner ? getOwnerProfile(owner.id) : null;
  const stats = getOwnerStats(owner, team);
  const isOpen = !owner;
  const streamingLinks: StreamingLink[] = [];
  if (owner?.youtubeUrl) streamingLinks.push(["YouTube", owner.youtubeUrl, Youtube]);
  if (owner?.twitchChannel) streamingLinks.push(["Twitch", `https://www.twitch.tv/${owner.twitchChannel}`, Radio]);
  if (owner?.kickUrl) streamingLinks.push(["Kick", owner.kickUrl, Radio]);

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt={`${team.fullName} owner profile backdrop`} fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.68),#05070a)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <TeamMark abbreviation={team.abbreviation} primaryColor={team.primaryColor} secondaryColor={team.secondaryColor} />
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                  <Shield className="size-4" />
                  {isOpen ? "Open Team Profile" : "Owner Profile"}
                </p>
                <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">{owner?.name ?? "Open Team"}</h1>
                <p className="mt-3 text-lg font-semibold text-chrome-200">{team.fullName} {owner ? `| ${owner.gamertag}` : "| Available"}</p>
              </div>
            </div>
            <Button asChild variant={isOpen ? "electric" : "chrome"} size="lg">
              <Link href={isOpen ? `/apply?team=${team.id}` : "/owners"}>{isOpen ? "Apply for This Team" : "Back to Owners"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <div className="grid place-items-center rounded-md border border-white/10 bg-black/45 p-6">
            {owner?.avatarSrc ? (
              <Image src={owner.avatarSrc} alt={`${owner.name} profile photo`} width={160} height={160} className="size-36 rounded-md object-cover" />
            ) : (
              <Image src="/league-logo.png" alt="Default National Franchise League shield avatar" width={160} height={220} className="h-36 w-auto object-contain drop-shadow-[0_0_28px_rgba(0,163,255,0.42)]" />
            )}
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-md border border-white/10 bg-black/35 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Status</p>
              <p className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{ownerStatusLabel(owner?.status, owner?.role)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/35 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Time Zone</p>
              <p className="mt-1 text-lg font-bold text-white">{owner?.timezone ?? "Commissioner review"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/35 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Preferred Broadcast</p>
              <p className="mt-1 text-lg font-bold text-white">{owner?.preferredPlatform ?? "Not linked"}</p>
            </div>
          </div>

          {streamingLinks.length > 0 ? (
            <div className="mt-5 grid gap-2">
              {streamingLinks.map(([label, href, Icon]) => (
                <Button key={label} asChild variant="chrome" className="w-full">
                  <Link href={href} target="_blank" rel="noreferrer">
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          ) : null}
        </aside>

        <div className="grid gap-6">
          <article className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <UserRound className="size-4" />
              Owner Bio
            </p>
            <p className="mt-4 text-base leading-8 text-chrome-200">
              {owner?.bio ?? "This team is currently open. Apply for this team to join the National Franchise League owner community."}
            </p>
          </article>

          {owner ? (
            <article className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
                <Shield className="size-4" />
                Current League Status
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-chrome-400">Membership</p>
                  <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">{ownerStatusLabel(owner.status, owner.role)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-chrome-400">Hall of Fame</p>
                  <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">{owner.hallOfFame ? "Yes" : "No"}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-chrome-300">
                Owner profiles are permanent. If an owner leaves, the team can be opened while awards, past teams, seasons, and records remain attached to this stable owner profile.
              </p>
            </article>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map(([label, value]) => (
              <article key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-chrome-400">{label}</p>
                <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">{value}</p>
              </article>
            ))}
          </div>

          <article className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <Award className="size-4" />
              Achievement Badges
            </p>
            {achievements.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {achievements.map((achievement) => (
                  <span key={achievement.id} className="rounded-md border border-electric/35 bg-electric/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-electric">
                    {achievement.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-chrome-300">No achievement badges assigned yet. Badges are commissioner-assigned until league-data automation is connected.</p>
            )}
          </article>

          <article className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
              <CalendarDays className="size-4" />
              Owner Timeline
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <Clock className="size-5 text-electric" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Owner Since</p>
                <p className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-white">{owner?.ownerSince ?? "Open"}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                <Trophy className="size-5 text-electric" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Awards</p>
                <p className="mt-1 text-sm font-bold text-white">{owner?.awards.length ? owner.awards.join(", ") : "None assigned"}</p>
              </div>
            </div>
            {owner && permanentProfile ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Past Teams</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {permanentProfile.pastTeams.length ? permanentProfile.pastTeams.map((pastTeam) => pastTeam?.fullName).join(", ") : "None"}
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Season History</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {permanentProfile.seasonHistory.length ? permanentProfile.seasonHistory.map((history) => `${history.season}: ${history.record}`).join(", ") : "Current season pending"}
                  </p>
                </div>
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}
