import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

export default async function CommissionerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-black px-5 py-16 text-white">
      <section className="premium-card w-full max-w-md rounded-md border border-white/12 p-6 shadow-chrome backdrop-blur-xl">
        <Image src="/league-logo.png" alt="National Franchise League logo" width={120} height={164} className="mx-auto h-32 w-auto object-contain drop-shadow-[0_0_28px_rgba(0,163,255,0.44)]" priority />
        <p className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
          <LockKeyhole className="size-4" />
          Secure Commissioner Access
        </p>
        <h1 className="mt-3 text-center font-[var(--font-oswald)] text-4xl font-bold uppercase text-white">Commissioner Dashboard</h1>
        <p className="mt-3 text-center text-sm leading-6 text-chrome-300">Sign in to manage games, owners, trades, announcements, rules, and league operations.</p>
        {params.error ? <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Invalid commissioner password.</p> : null}
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-chrome-300" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="h-12 w-full rounded-md border border-white/15 bg-black/55 px-4 text-white outline-none transition focus:border-electric focus:shadow-electric" />
          <Button type="submit" variant="electric" size="lg" className="w-full">Sign In</Button>
        </form>
        <Link href="/" className="mt-5 block text-center text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white">Back to League Hub</Link>
      </section>
    </main>
  );
}
