import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Headphones, Instagram, Newspaper, Play, Radio, Sparkles, Twitch, Youtube, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLeague } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Media | National Franchise League",
  description: "National Franchise League featured games, Instagram spotlight, YouTube highlights, live broadcasts, and weekly recap coverage.",
};

export const dynamic = "force-dynamic";

const instagramHandle = "@nfl.madden25";
const instagramUrl = "https://www.instagram.com/nfl.madden25/";
const siteMeta = {
  version: "v2026.07.28",
  lastUpdated: "July 28, 2026",
};

function cleanEnv(value?: string) {
  return value?.trim() || "";
}

function isYouTubeVideoId(value: string) {
  return /^[a-zA-Z0-9_-]{8,}$/.test(value);
}

function isYouTubePlaylistId(value: string) {
  return /^[a-zA-Z0-9_-]{10,}$/.test(value);
}

function PlaceholderCard({ title, body, icon: Icon }: { title: string; body: string; icon: LucideIcon }) {
  return (
    <div className="grid min-h-full place-items-center rounded-md border border-dashed border-white/15 bg-[linear-gradient(135deg,rgba(0,163,255,0.12),rgba(255,255,255,0.04),rgba(0,0,0,0.5))] p-6 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-md border border-electric/35 bg-electric/10 text-electric shadow-electric">
          <Icon className="size-7" />
        </span>
        <h3 className="mt-5 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">{title}</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-chrome-300">{body}</p>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const league = getLeague();
  const youtubeChannel = league.youtubeChannelUrl;
  const youtubeVideos = `${youtubeChannel}/videos`;
  const youtubeLiveUrl = `${youtubeChannel}/live`;
  const twitchUrl = `https://www.twitch.tv/${league.twitchChannel}`;
  const featuredVideoId = cleanEnv(process.env.NEXT_PUBLIC_FEATURED_YOUTUBE_VIDEO_ID);
  const highlightsPlaylistId = cleanEnv(process.env.NEXT_PUBLIC_YOUTUBE_HIGHLIGHTS_PLAYLIST_ID ?? process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID);
  const instagramPostUrl = cleanEnv(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL);
  const hasFeaturedVideo = isYouTubeVideoId(featuredVideoId);
  const hasPlaylist = isYouTubePlaylistId(highlightsPlaylistId);
  const broadcastLinks: [string, string, LucideIcon][] = [
    ["YouTube Live", youtubeLiveUrl, Youtube],
    ["Twitch", twitchUrl, Twitch],
  ];

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League media highlights" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.70),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Radio className="size-4" />
            League Content Hub
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Media</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Official National Franchise League videos, highlights, Instagram coverage, live broadcasts, and commissioner-approved weekly stories.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 xl:grid-cols-[1.12fr_0.88fr]">
        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Play className="size-4" />
            Featured Game of the Week
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Latest League Feature</h2>
          <p className="mt-3 text-sm leading-6 text-chrome-300">The main video slot promotes the newest official game, highlight, or recap from the league channel.</p>
          <div className="mt-5 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
            {hasFeaturedVideo ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${featuredVideoId}`}
                title="National Franchise League featured game of the week"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <PlaceholderCard
                icon={Play}
                title="Game of the Week content coming soon"
                body="A featured game, highlight, or recap will appear here once a valid official YouTube video is configured."
              />
            )}
          </div>
          <Button asChild variant="electric" size="lg" className="mt-5 w-full">
            <Link href={hasFeaturedVideo ? `https://www.youtube.com/watch?v=${featuredVideoId}` : youtubeVideos} target="_blank" rel="noreferrer">
              <Youtube className="size-5" />
              {hasFeaturedVideo ? "Watch on YouTube" : "Open YouTube Videos"}
            </Link>
          </Button>
        </article>

        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Instagram className="size-4" />
            Instagram Spotlight
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">{instagramHandle}</h2>
          <div className="mt-5 rounded-md border border-white/12 bg-black/45 p-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Image src="/league-logo.png" alt="National Franchise League Instagram avatar" width={56} height={76} className="h-14 w-auto object-contain" />
              <div>
                <p className="font-bold text-white">National Franchise League</p>
                <p className="text-sm text-chrome-400">{instagramHandle}</p>
              </div>
            </div>
            <div className="mt-4 grid aspect-square place-items-center rounded-md border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(0,163,255,0.28),transparent_28%),linear-gradient(145deg,#070a0f,#111827_48%,#05070a)] p-6 text-center">
              <div>
                <Instagram className="mx-auto size-16 text-electric drop-shadow-[0_0_24px_rgba(0,163,255,0.44)]" />
                <h3 className="mt-5 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none">League post spotlight coming soon</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-chrome-300">
                  A specific public post can be featured here once its official Instagram URL is configured.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="electric" size="lg">
                <Link href={instagramPostUrl || instagramUrl} target="_blank" rel="noreferrer">
                  <Instagram className="size-5" />
                  {instagramPostUrl ? "View Latest Post" : "View Instagram"}
                </Link>
              </Button>
              <Button asChild variant="chrome" size="lg">
                <Link href={youtubeChannel} target="_blank" rel="noreferrer">
                  <Youtube className="size-5" />
                  League YouTube
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 md:px-8 xl:grid-cols-2">
        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Youtube className="size-4" />
            YouTube Highlights
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Highlights Playlist</h2>
          <div className="mt-5 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
            {hasPlaylist ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${highlightsPlaylistId}`}
                title="National Franchise League YouTube highlights playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <PlaceholderCard icon={Youtube} title="Highlights playlist coming soon" body="A playlist will appear here after a valid official YouTube playlist ID is added." />
            )}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button asChild variant="chrome" size="lg">
              <Link href={youtubeChannel} target="_blank" rel="noreferrer">
                <Youtube className="size-5" />
                League YouTube
              </Link>
            </Button>
            <Button asChild variant="chrome" size="lg">
              <Link href={youtubeVideos} target="_blank" rel="noreferrer">
                <ExternalLink className="size-5" />
                Open Highlights
              </Link>
            </Button>
          </div>
        </article>

        <div className="grid gap-6">
          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <Headphones className="size-4" />
              Official Audio Show
            </p>
            <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">The Commissioner Report</h2>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              The future weekly audio desk for commissioner-approved coverage of scores, biggest upsets, players of the week, power rankings, trades, and next-week previews.
            </p>
            <Button asChild variant="electric" size="lg" className="mt-5 w-full">
              <Link href="/commissioner-report">
                <Headphones className="size-5" />
                Open The Commissioner Report
              </Link>
            </Button>
          </article>

          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <Radio className="size-4" />
              Live Broadcast
            </p>
            <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Twitch and YouTube Live</h2>
            <p className="mt-4 rounded-md border border-white/10 bg-black/35 p-4 text-sm font-semibold text-chrome-300">No live league broadcast currently.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {broadcastLinks.map(([label, href, Icon]) => (
                <Button key={label} asChild variant="chrome" size="lg">
                  <Link href={href} target="_blank" rel="noreferrer">
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <Newspaper className="size-4" />
              Weekly Recap
            </p>
            <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">League Coverage Desk</h2>
            <p className="mt-3 text-sm leading-6 text-chrome-300">
              Read commissioner-approved AI-generated league coverage built around official scores, stories, and weekly milestones.
            </p>
            <Button asChild variant="chrome" size="lg" className="mt-5 w-full">
              <Link href="/weekly-recap">
                <Sparkles className="size-5" />
                Open Weekly Recap
              </Link>
            </Button>
          </article>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-6 text-center md:px-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-chrome-600">
          Site {siteMeta.version} | Last updated {siteMeta.lastUpdated}
        </p>
      </footer>
    </main>
  );
}
