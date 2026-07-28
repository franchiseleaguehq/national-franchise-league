import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, FileText, KeyRound, LockKeyhole, RotateCcw, ShieldCheck, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCommissionerSetup } from "@/lib/db/commissioner-store";
import { getOwnerDirectory, getUnassignedOwnerProfiles } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Owner Portal | National Franchise League",
  description: "Owner sign-in, owner directory, open teams, applications, and rulebook access for the National Franchise League.",
};

export const dynamic = "force-dynamic";

function PortalAction({ href, icon: Icon, title, note, primary = false }: { href: string; icon: LucideIcon; title: string; note: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`group grid min-h-24 gap-2 rounded-md border p-4 transition duration-300 hover:-translate-y-0.5 ${
        primary ? "border-electric/50 bg-electric/12 shadow-electric" : "border-white/10 bg-black/42 hover:border-electric/45"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-md ${primary ? "bg-electric text-black" : "bg-white/10 text-electric"}`}>
          <Icon className="size-5" />
        </span>
        <span className="font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">{title}</span>
      </div>
      <span className="text-sm leading-6 text-chrome-300">{note}</span>
    </Link>
  );
}

export default async function OwnerPortalPage() {
  await getCommissionerSetup();
  const directory = getOwnerDirectory();
  const unassignedOwners = getUnassignedOwnerProfiles();
  const openTeams = directory.filter((entry) => !entry.owner).length;
  const activeOwners = directory.filter((entry) => entry.owner).length + unassignedOwners.length;

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League owner portal" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.72),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <ShieldCheck className="size-4" />
            Owner Portal
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">National Franchise League Owner Portal</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Manage owner access, review open teams, apply for membership, and jump into the official league resources from one mobile-first hub.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Active Profiles</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{activeOwners}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Open Teams</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">{openTeams}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-400">Approval</p>
              <p className="mt-1 font-[var(--font-oswald)] text-3xl font-bold text-white">Manual</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-2">
        <article id="sign-in-coming-soon" className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-md bg-electric text-black shadow-electric">
              <UserRound className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Existing Owner</p>
              <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Owner Access</h2>
              <p className="mt-3 text-sm leading-6 text-chrome-300">
                Owner authentication is staged as a future phase. The directory and public profiles are live, while profile editing remains locked until commissioner-approved sign-in is connected.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PortalAction href="#sign-in-coming-soon" icon={LockKeyhole} title="Sign In" note="Sign In Coming Soon. Active-owner access is not public yet." primary />
            <PortalAction href="/owners" icon={Users} title="View Owner Directory" note="Browse all 32 teams, current owners, and open teams." />
            <PortalAction href="/commissioner/login" icon={UserRound} title="My Profile" note="Sign in as Commissioner after setup to access your linked permanent profile." />
            <PortalAction href="#reset-password-coming-soon" icon={RotateCcw} title="Reset Password" note="Password reset will activate after owner authentication is approved." />
          </div>
        </article>

        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-md bg-electric text-black shadow-electric">
              <ClipboardList className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Become an Owner</p>
              <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Join the League</h2>
              <p className="mt-3 text-sm leading-6 text-chrome-300">
                Applications go into Pending Commissioner Review. Approved owners start unassigned and enter the Commissioner-run team lottery before selecting a team.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PortalAction href="/apply" icon={ClipboardList} title="Apply to Join" note="Submit your application for commissioner review." primary />
            <PortalAction href="/owners#open-teams" icon={Users} title="View Lottery Teams" note="See every team available for the Commissioner-run lottery." />
            <PortalAction href="/rules#orientation" icon={KeyRound} title="Read Rookie Orientation" note="Start with the new-owner basics before applying." />
            <PortalAction href="/rules" icon={FileText} title="Read Official Rulebook" note="Review the full National Franchise League rulebook." />
          </div>
        </article>
      </section>

      <section id="reset-password-coming-soon" className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="rounded-md border border-electric/25 bg-electric/10 p-5 text-sm leading-6 text-chrome-200">
          <strong className="font-bold text-white">Profile access status:</strong> owner self-editing and password reset are intentionally locked for this preview. Public users can view profiles and apply, but cannot edit owner data, approve applications, or assign teams.
        </div>
      </section>
    </main>
  );
}
