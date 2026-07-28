import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AudioLines, CalendarDays, Headphones, ListMusic, Mic2, Newspaper, Play, Radio, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { commissionerReport } from "@/lib/media/commissioner-report";

export const metadata: Metadata = {
  title: "The Commissioner Report | National Franchise League",
  description: "Official National Franchise League audio show covering weekly scores, upsets, power rankings, trades, and upcoming Madden matchups.",
};

function AudioPlaceholder() {
  return (
    <div className="grid min-h-64 place-items-center rounded-md border border-dashed border-white/15 bg-[linear-gradient(135deg,rgba(0,163,255,0.14),rgba(255,255,255,0.045),rgba(0,0,0,0.62))] p-6 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-md border border-electric/35 bg-electric/10 text-electric shadow-electric">
          <Headphones className="size-8" />
        </span>
        <h2 className="mt-5 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none text-white">First episode coming soon</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-chrome-300">
          The official audio player will appear here once the first Commissioner Report episode is published.
        </p>
      </div>
    </div>
  );
}

export default function CommissionerReportPage() {
  const latestEpisode = commissionerReport.episodes[0];
  const hasAudio = Boolean(latestEpisode.audioUrl);

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="The Commissioner Report studio backdrop" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.72),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Radio className="size-4" />
            Official Audio Show
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">{commissionerReport.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">{commissionerReport.tagline}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-electric shadow-electric">
              <Mic2 className="size-3" />
              {latestEpisode.label}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
              {commissionerReport.cadence}
            </span>
          </div>

          <h2 className="mt-5 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none md:text-5xl">{latestEpisode.title}</h2>
          <p className="mt-2 text-base font-bold text-electric">{latestEpisode.subtitle}</p>
          <p className="mt-4 text-sm leading-6 text-chrome-300">{latestEpisode.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {latestEpisode.hosts.map((host) => (
              <div key={host} className="flex min-h-14 items-center gap-3 rounded-md border border-white/10 bg-black/35 px-4 py-3">
                <UserRound className="size-5 text-electric" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-chrome-400">Host</p>
                  <p className="font-bold text-white">{host}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-md border border-white/12 bg-black/45 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-electric">
              <Headphones className="size-4" />
              Demo Player
            </p>
            {hasAudio ? (
              <audio controls preload="metadata" className="w-full rounded-md" aria-label={`${latestEpisode.title} demo audio`}>
                <source src={latestEpisode.audioUrl} type={latestEpisode.audioType ?? "audio/mpeg"} />
                Your browser does not support the audio player.
              </audio>
            ) : (
              <AudioPlaceholder />
            )}
            <p className="mt-3 text-sm font-semibold leading-6 text-chrome-300">
              Demo audio is temporary. The final broadcast audio is coming soon and can replace this file without changing the page layout.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-electric/25 bg-electric/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric">Official Opening</p>
            <div className="mt-3 grid gap-3 text-base font-semibold leading-7 text-white">
              {commissionerReport.officialOpening.map((line) => (
                <p key={line}>“{line}”</p>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button asChild variant="electric" size="lg">
              <Link href="/media">
                <Play className="size-5" />
                Back to Media Hub
              </Link>
            </Button>
            <Button asChild variant="chrome" size="lg">
              <Link href="/weekly-recap">
                <Newspaper className="size-5" />
                Weekly Recap
              </Link>
            </Button>
          </div>
        </article>

        <aside className="grid gap-6">
          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <Sparkles className="size-4" />
              Show Format
            </p>
            <p className="mt-3 text-sm leading-6 text-chrome-300">{commissionerReport.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {commissionerReport.topics.map((topic) => (
                <div key={topic} className="rounded-md border border-white/10 bg-black/35 p-3">
                  <p className="text-sm font-bold text-white">{topic}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <ListMusic className="size-4" />
              Episode Queue
            </p>
            <div className="mt-4 grid gap-3">
              {commissionerReport.episodes.map((episode) => (
                <div key={episode.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-electric/35 bg-electric/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-electric">{episode.label}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                      <CalendarDays className="size-3" />
                      {episode.publishDate}
                    </span>
                  </div>
                  <h3 className="mt-3 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">{episode.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-chrome-300">{episode.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {episode.topics.map((topic) => (
                      <span key={topic} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-chrome-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <AudioLines className="size-4" />
              Production Notes
            </p>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              This page is ready for hosted episode audio, show notes, YouTube companion links, and automated weekly script generation once league results are connected.
            </p>
          </article>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-4 py-6 text-center md:px-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-chrome-600">
          Show {commissionerReport.version} | Last updated {commissionerReport.lastUpdated}
        </p>
      </footer>
    </main>
  );
}
