import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CalendarDays, ClipboardList, Dice5, ListChecks, Scale, ShieldCheck, Trophy, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCommissionerSession } from "@/lib/auth/session";
import { getCommissionerSetup } from "@/lib/db/commissioner-store";
import { applicationStatusLabel, getCommissionerDashboardData, getTeamLotteryData } from "@/lib/db/repositories";
import { OwnerWorkflowPanel } from "./owner-workflow-panel";
import { TeamLotteryPanel } from "./team-lottery-panel";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="premium-card rounded-md border border-white/12 p-4 shadow-chrome backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">{label}</p>
      <p className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase text-white">{value}</p>
    </div>
  );
}

function MiniStatusCard({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">{label}</p>
      <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">{value}</p>
      <p className="mt-1 text-sm leading-6 text-chrome-300">{note}</p>
    </div>
  );
}

export default async function CommissionerDashboardPage() {
  const session = await getCommissionerSession();
  if (!session) redirect("/commissioner/login");
  const setup = await getCommissionerSetup();
  if (!setup || setup.account.ownerId !== session.ownerId) redirect("/commissioner/login");

  const data = getCommissionerDashboardData();
  const lotteryData = getTeamLotteryData();
  const formerOwner = data.owners.find((owner) => owner.status === "former");
  const profileHref = `/owners/${setup.owner.slug}`;
  const recentCommissionerActions: Array<{ title: string; note: string; Icon: LucideIcon }> = [
    { title: "Setup Ready", note: "One-time Commissioner account setup is waiting for durable storage and first account creation.", Icon: ShieldCheck },
    { title: "Lottery Policy Active", note: "No owner can choose or reserve a team before the Commissioner-run lottery.", Icon: Dice5 },
    { title: "Owner Profiles Empty", note: "No seeded users or sample Commissioner accounts are present in production seed data.", Icon: UserRound },
  ];

  return (
    <main id="top" className="min-h-screen bg-black px-5 py-10 text-white md:px-8">
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="chrome" size="lg"><Link href={profileHref}>My Profile</Link></Button>
            <Button asChild variant="chrome" size="lg"><Link href="/owners">Owner Directory</Link></Button>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="chrome" size="lg" className="w-full">Logout</Button>
            </form>
          </div>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {[
            ["Commissioner Hub", "#top"],
            ["Applications", "#applications"],
            ["League Management", "#league-management"],
            ["Owners", "#owners"],
            ["Teams", "#teams"],
            ["Team Lottery", "#team-lottery"],
            ["Broadcasting", "#broadcasting"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="shrink-0 rounded-md border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-chrome-200 transition hover:border-electric/50 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Owners" value={data.owners.length} />
          <StatCard label="Teams" value={data.teams.length} />
          <StatCard label="Open Slots" value={data.openLeagueSlots} />
          <StatCard label="Applications" value={data.applications.length} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article id="league-management" className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><ClipboardList className="text-electric" /> Owner Onboarding</h2>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              Current Commissioner focus is reviewing applicants, filling the approved-owner pool, and preparing the team lottery before team assignments begin.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniStatusCard label="Pending Applications" value={data.pendingApplications.length} note="Need review, notes, approval, rejection, or more information." />
              <MiniStatusCard label="Approved Awaiting Lottery" value={data.approvedAwaitingLottery.length} note="Approved owners still unassigned until the lottery order is locked." />
              <MiniStatusCard label="Unassigned Owners" value={data.unassignedOwners.length} note="Includes the Commissioner and approved owners without teams." />
              <MiniStatusCard label="Open League Slots" value={data.openLeagueSlots} note="Available owner seats before the league reaches 32 owners." />
            </div>
            {!data.tradeQueueEnabled ? (
              <p className="mt-4 rounded-md border border-white/10 bg-white/[0.045] p-3 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                Future roster-movement tools stay offline until owner approvals, lottery, team assignments, companion data, and the official workflow are ready.
              </p>
            ) : null}
          </article>

          <article id="owners" className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
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

          <article id="teams" className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><Users className="text-electric" /> Owners</h2>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
              {data.owners.map((owner) => (
                <Link key={owner.id} href={`/owners/${owner.slug}`} className="block rounded-md border border-white/10 bg-black/35 p-3 transition hover:border-electric/60 hover:text-white">
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

          {data.tradeQueueEnabled ? (
            <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl lg:col-span-2">
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
          ) : null}

          <article id="broadcasting" className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl lg:col-span-2">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><ShieldCheck className="text-electric" /> Owner Portal Controls</h2>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              Commissioner-only controls define who can access active-owner tools and which information stays official league data. Public users cannot edit profiles, approve applications, assign teams, or change records.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["View all applications", "Review private application details inside this protected hub only."],
                ["Approve or reject", "Move applications through commissioner-controlled statuses."],
                ["Prepare lottery pool", "Approved owners stay unassigned until the lottery is ready."],
                ["Run team lottery", "Randomize, lock order, and record selections before team access."],
                ["Suspend or restore access", "Change owner access without deleting records."],
                ["Official records", "Update career numbers, awards, Hall of Fame status, badges, and notes."],
              ].map(([title, note]) => (
                <div key={title} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-chrome-300">{note}</p>
                </div>
              ))}
            </div>
          </article>

          <article id="applications" className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl lg:col-span-2">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><Bell className="text-electric" /> Application Inbox</h2>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              Applications are private to the commissioner area. Submitted applications remain pending until the commissioner reviews them; approval alone does not assign a team.
            </p>
            <div className="mt-4 grid gap-2">
              {data.applications.length > 0 ? data.applications.map((application) => (
                <div key={application.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">{applicationStatusLabel(application.status)}</p>
                  <p className="mt-2 font-bold text-white">{application.preferredDisplayName} | {application.gamertag}</p>
                  <p className="mt-1 text-sm text-chrome-300">{application.fullName} | {application.email}</p>
                  <p className="mt-1 text-sm text-chrome-300">Team preferences: {application.teamPreferenceNotes}</p>
                  <p className="mt-1 text-sm font-bold text-electric">Team Selection Status: Awaiting Lottery</p>
                  <p className="mt-2 text-sm leading-6 text-chrome-400">{application.reviewerNote ?? application.whyJoin}</p>
                </div>
              )) : (
                <div className="rounded-md border border-white/10 bg-black/35 p-4 text-sm text-chrome-300">No applications submitted in this server session.</div>
              )}
            </div>
          </article>

          <article className="lg:col-span-2">
            <OwnerWorkflowPanel
              applications={data.applications.map((application) => ({
                id: application.id,
                preferredDisplayName: application.preferredDisplayName,
                gamertag: application.gamertag,
                email: application.email,
                teamPreferenceNotes: application.teamPreferenceNotes,
                status: application.status,
              }))}
              formerOwner={formerOwner ? { id: formerOwner.id, name: formerOwner.name, slug: formerOwner.slug, status: formerOwner.status, teamId: formerOwner.teamId, pastTeamIds: formerOwner.pastTeamIds } : undefined}
            />
          </article>

          <article id="team-lottery" className="lg:col-span-2">
            <TeamLotteryPanel season={lotteryData.season} owners={lotteryData.poolOwners} teams={lotteryData.teams} />
          </article>

          <article className="premium-card rounded-md border border-white/12 p-5 shadow-chrome backdrop-blur-xl lg:col-span-2">
            <h2 className="flex items-center gap-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white"><ListChecks className="text-electric" /> Recent Commissioner Actions</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {recentCommissionerActions.map(({ title, note, Icon }) => (
                <div key={title} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <Icon className="size-5 text-electric" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-electric">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-chrome-300">{note}</p>
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
