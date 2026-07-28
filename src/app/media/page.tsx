import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play, Radio, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLeague } from "@/lib/db/repositories";

export const metadata: Metadata = {
  title: "Media | National Franchise League",
  description: "National Franchise League highlights, featured video, YouTube playlist, and Madden social links.",
};

export const dynamic = "force-dynamic";

export default function MediaPage() {
  const league = getLeague();
  const youtubeChannel = league.youtubeChannelUrl;
  const featuredVideo = `${youtubeChannel}/videos`;
  const maddenSocialPage = "https://linktr.ee/eamaddennfl";

  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League media highlights" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.70),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Radio className="size-4" />
            Highlights Hub
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Media</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            Featured videos, weekly highlights, and Madden social links for the National Franchise League broadcast desk.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Play className="size-4" />
            Featured Video
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Latest League Highlight</h2>
          <p className="mt-3 text-sm leading-6 text-chrome-300">
            The featured video area promotes the newest official National Franchise League YouTube content.
          </p>
          <div className="mt-5 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed?listType=user_uploads&list=NFL.Madden25"
              title="National Franchise League featured video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <Button asChild variant="electric" size="lg" className="mt-5 w-full">
            <Link href={featuredVideo} target="_blank" rel="noreferrer">
              <Youtube className="size-5" />
              Open YouTube Channel
            </Link>
          </Button>
        </article>

        <article className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Youtube className="size-4" />
            YouTube Playlist
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">Highlights Playlist</h2>
          <div className="mt-5 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/videoseries?list=UUNFLMadden25"
              title="National Franchise League YouTube playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button asChild variant="chrome" size="lg">
              <Link href={youtubeChannel} target="_blank" rel="noreferrer">
                <Youtube className="size-5" />
                League YouTube
              </Link>
            </Button>
            <Button asChild variant="chrome" size="lg">
              <Link href={maddenSocialPage} target="_blank" rel="noreferrer">
                <ExternalLink className="size-5" />
                Madden Social Page
              </Link>
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
}
