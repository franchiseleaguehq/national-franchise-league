import Link from "next/link";
import { notFound } from "next/navigation";
import { Gamepad2, Radio, Shield } from "lucide-react";

import { getOwnerProfile, listOwnerIds } from "@/lib/db/repositories";

export function generateStaticParams() {
  return listOwnerIds().map((ownerId) => ({ ownerId }));
}

export default async function OwnerProfilePage({ params }: { params: Promise<{ ownerId: string }> }) {
  const { ownerId } = await params;
  const profile = getOwnerProfile(ownerId);
  if (!profile) notFound();

  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric"><Gamepad2 className="size-4" /> Owner Profile</p>
        <h1 className="mt-3 font-[var(--font-oswald)] text-6xl font-bold uppercase text-white">{profile.owner.name}</h1>
        <p className="mt-3 text-xl text-chrome-300">{profile.owner.gamertag} | {profile.owner.role}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="premium-card rounded-md border border-white/12 p-5"><Shield className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Team</p><p className="mt-1 text-2xl font-bold text-white">{profile.team?.fullName ?? "Unassigned"}</p></div>
          <div className="premium-card rounded-md border border-white/12 p-5"><Radio className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Twitch</p><p className="mt-1 text-2xl font-bold text-white">{profile.owner.twitchChannel ?? "Not linked"}</p></div>
          <div className="premium-card rounded-md border border-white/12 p-5"><Gamepad2 className="text-electric" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-chrome-400">Games</p><p className="mt-1 text-2xl font-bold text-white">{profile.games.length}</p></div>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white">Back to League Hub</Link>
      </section>
    </main>
  );
}
