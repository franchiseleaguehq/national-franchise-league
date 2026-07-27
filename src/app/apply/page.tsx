import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, FileText, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getApplicationTeams } from "@/lib/db/repositories";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = {
  title: "Apply to Join | National Franchise League",
  description: "Apply to join the National Franchise League Madden owner community.",
};

export default function ApplyPage() {
  const teams = getApplicationTeams();
  const openTeams = teams.filter((team) => team.isOpen).length;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="Football stadium lights" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.76),#05070a)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <ClipboardList className="size-4" />
            Owner Application
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">Apply to Join</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Submit your owner application for commissioner review. Private application details are not shown publicly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="chrome">
              <Link href="/rules#orientation">
                <FileText className="size-4" />
                Read Rookie Orientation
              </Link>
            </Button>
            <Button asChild variant="chrome">
              <Link href="/owners#open-teams">
                <Users className="size-4" />
                View Open Teams
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <ShieldCheck className="size-8 text-electric" />
          <h2 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase">Application Desk</h2>
          <p className="mt-3 text-sm leading-6 text-chrome-300">
            {openTeams} teams are marked open in this draft. Commissioner review is required before any owner is assigned.
          </p>
        </aside>
        <article className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
          <ApplicationForm teams={teams} />
        </article>
      </section>
    </main>
  );
}
