"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Film } from "lucide-react";

const twitchLive = process.env.NEXT_PUBLIC_TWITCH_LIVE === "true";

function getNextAdvance() {
  const now = new Date();
  const next = new Date(now);
  const targetDay = 3;
  const daysUntil = (targetDay - now.getDay() + 7) % 7 || 7;

  next.setDate(now.getDate() + daysUntil);
  next.setHours(21, 0, 0, 0);

  return next;
}

function formatTimeLeft(target: Date): Array<[number, string]> {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return [
    [days, "D"],
    [hours, "H"],
    [minutes, "M"],
    [seconds, "S"],
  ];
}

export function LiveBadge() {
  if (!twitchLive) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-chrome-200 backdrop-blur">
        <span className="size-2 rounded-full bg-chrome-400" />
        Offline
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(239,68,68,0.75)]">
      <span className="size-2 rounded-full bg-white animate-pulse" />
      Live
    </span>
  );
}

function CountdownCard({ label, target }: { label: string; target: Date }) {
  const [parts, setParts] = useState<Array<[number, string]>>([
    [0, "D"],
    [0, "H"],
    [0, "M"],
    [0, "S"],
  ]);

  useEffect(() => {
    setParts(formatTimeLeft(target));

    const interval = window.setInterval(() => {
      setParts(formatTimeLeft(target));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <div className="rounded-md border border-white/12 bg-black/45 p-4 shadow-chrome backdrop-blur">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-electric">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {parts.map(([value, label]) => (
          <div key={label} className="rounded-md border border-white/10 bg-white/[0.08] p-2 text-center">
            <p className="font-[var(--font-oswald)] text-2xl font-bold text-white">
              {String(value).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-chrome-300">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdvanceCountdown() {
  const target = useMemo(() => getNextAdvance(), []);

  return <CountdownCard label="Next league advance" target={target} />;
}

export function KickoffCountdown({ kickoffIso }: { kickoffIso: string }) {
  const target = useMemo(() => new Date(kickoffIso), [kickoffIso]);

  return <CountdownCard label="Countdown to kickoff" target={target} />;
}

export function BroadcastPlayer() {
  const trailerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trailerRef.current?.play().catch(() => undefined);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="absolute -inset-6 rounded-[2rem] bg-electric/20 blur-3xl animate-pulseGlow" />
      <div className="absolute -right-4 top-12 h-52 w-32 rotate-12 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -left-10 bottom-12 h-52 w-52 rounded-full bg-electric/15 blur-3xl" />
      <div className="relative w-full max-w-[270px] rounded-[1.7rem] border border-white/25 bg-gradient-to-br from-white/35 via-chrome-500/30 to-black p-1.5 shadow-[0_42px_130px_rgba(0,0,0,0.68)] sm:max-w-[300px] lg:max-w-[320px] xl:max-w-[340px]">
        <div className="rounded-[1.6rem] bg-black p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_42px_rgba(255,255,255,0.04)]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[1.15rem] border border-white/10 bg-black">
            <video
              ref={trailerRef}
              className="absolute inset-0 size-full bg-black object-contain"
              autoPlay
              controls
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="National Franchise League promotional trailer"
            >
              <source src="/league-trailer.mov" />
              Your browser cannot play the National Franchise League trailer.
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_16%,transparent_62%,rgba(255,255,255,0.1)_78%,transparent_100%)]" />
            <div className="pointer-events-none absolute -left-12 top-8 h-64 w-20 rotate-12 rounded-full bg-white/16 blur-xl" />
            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <span className="inline-flex items-center gap-2">
                <Film className="size-4 text-electric" />
                Promotional Trailer
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-3 w-full max-w-[420px] rounded-md border border-white/15 bg-black/55 px-4 py-2.5 text-center shadow-chrome backdrop-blur">
        <p className="font-[var(--font-oswald)] text-lg font-bold uppercase text-white">National Franchise League Season Trailer</p>
        <p className="mt-1 text-xs text-chrome-300">Team logo reveals, broadcast energy, and the league identity front and center.</p>
      </div>
    </div>
  );
}
