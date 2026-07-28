import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { commissionerAccountExists } from "@/lib/db/commissioner-store";

export const dynamic = "force-dynamic";

function Field({ label, name, type = "text", required = true, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-chrome-200">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        minLength={type === "password" ? 12 : undefined}
        className="min-h-12 rounded-md border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none transition placeholder:text-chrome-500 focus:border-electric"
      />
    </label>
  );
}

export default async function CommissionerSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await commissionerAccountExists()) redirect("/commissioner/login");

  const params = await searchParams;
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-md border border-white/12 bg-white/[0.045] p-5 shadow-chrome md:p-8">
          <Image src="/league-logo.png" alt="National Franchise League logo" width={96} height={132} className="h-28 w-auto object-contain drop-shadow-[0_0_28px_rgba(0,163,255,0.44)]" priority />
          <p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-electric">
            <ShieldCheck className="size-4" />
            One-Time Commissioner Setup
          </p>
          <h1 className="mt-3 break-words font-[var(--font-oswald)] text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-7xl">Create Commissioner Account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-chrome-300">
            This page creates the first secure Commissioner account and a permanent linked Owner Profile. It disables itself after setup is complete.
          </p>

          {params.error ? (
            <p className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-100">
              {params.error === "storage"
                ? "Commissioner account storage is not configured for production. Connect durable KV storage before creating the first Commissioner account."
                : "Setup could not be completed. Use a 12+ character password, matching confirmation, and valid HTTPS links."}
            </p>
          ) : null}

          <form action="/api/auth/setup" method="post" className="mt-8 grid gap-8">
            <section className="grid gap-4 rounded-md border border-white/10 bg-black/35 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                <KeyRound className="size-4" />
                Secure Login
              </p>
              <div className="grid min-w-0 gap-4 md:grid-cols-3">
                <Field label="Email address" name="email" type="email" placeholder="commissioner@example.com" />
                <Field label="Secure password" name="password" type="password" placeholder="12+ characters" />
                <Field label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter password" />
              </div>
            </section>

            <section className="grid gap-4 rounded-md border border-white/10 bg-black/35 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
                <UserRound className="size-4" />
                Linked Owner Profile
              </p>
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <Field label="Display name" name="displayName" placeholder="Name shown publicly" />
                <Field label="Gamertag" name="gamertag" placeholder="PSN / Madden name" />
                <Field label="Profile photo URL optional" name="avatarSrc" type="url" required={false} placeholder="https://..." />
                <Field label="Time zone" name="timezone" placeholder="Eastern, Central, Pacific..." />
              </div>
              <label className="grid gap-2 text-sm font-bold text-chrome-200">
                Short bio
                <textarea name="bio" required rows={4} className="rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white outline-none transition placeholder:text-chrome-500 focus:border-electric" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-electric/25 bg-electric/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Current Team</p>
                  <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Unassigned</p>
                </div>
                <div className="rounded-md border border-electric/25 bg-electric/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Team Selection Status</p>
                  <p className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Awaiting Lottery</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 rounded-md border border-white/10 bg-black/35 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Broadcasting</p>
              <div className="grid min-w-0 gap-4 md:grid-cols-3">
                <Field label="YouTube channel optional" name="youtubeUrl" type="url" required={false} placeholder="https://youtube.com/..." />
                <Field label="Twitch channel optional" name="twitchChannel" required={false} placeholder="channel name" />
                <Field label="Kick channel optional" name="kickUrl" type="url" required={false} placeholder="https://kick.com/..." />
              </div>
              <label className="grid gap-2 text-sm font-bold text-chrome-200">
                Preferred streaming platform optional
                <select name="preferredPlatform" defaultValue="None" className="min-h-12 rounded-md border border-white/10 bg-black px-4 text-base text-white outline-none transition focus:border-electric">
                  <option value="None">None</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitch">Twitch</option>
                  <option value="Kick">Kick</option>
                </select>
              </label>
            </section>

            <Button type="submit" variant="electric" size="xl" className="w-full">Create Commissioner Account</Button>
          </form>
          <Link href="/" className="mt-6 block text-center text-sm font-bold uppercase tracking-[0.16em] text-chrome-300 transition hover:text-white">Back to League Hub</Link>
        </div>
      </section>
    </main>
  );
}
