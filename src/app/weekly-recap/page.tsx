import type { Metadata } from "next";
import Image from "next/image";
import { Newspaper, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Weekly Recap | National Franchise League",
  description: "Future AI-generated National Franchise League weekly Madden recaps.",
};

export default function WeeklyRecapPage() {
  return (
    <main className="min-h-screen bg-black pb-14 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-10 pt-28 md:px-8">
        <Image src="/stadium-hero.png" alt="National Franchise League weekly recap" fill priority className="object-cover opacity-45" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.70),#05070a)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <Newspaper className="size-4" />
            Weekly Recap
          </p>
          <h1 className="mt-3 font-[var(--font-oswald)] text-5xl font-bold uppercase leading-none md:text-7xl">League Recap Desk</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-chrome-200">
            AI-generated Madden league recaps will live here after completed games, final scores, and owner data are available.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <article className="rounded-md border border-electric/25 bg-electric/10 p-6 shadow-chrome">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
            <Sparkles className="size-4" />
            Future AI Recap Placeholder
          </p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-none">No Public Message Board</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-chrome-200">
            This page is reserved for official weekly summaries only: game results, standout performances, owner notes, and Commissioner-approved storylines.
          </p>
        </article>
      </section>
    </main>
  );
}
