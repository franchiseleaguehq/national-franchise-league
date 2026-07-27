"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type ApplicationTeam = {
  id: string;
  label: string;
  isOpen: boolean;
};

function Field({ label, name, type = "text", required = true, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-chrome-200">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="min-h-12 rounded-md border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none transition placeholder:text-chrome-500 focus:border-electric"
      />
    </label>
  );
}

function TextArea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-chrome-200">
      {label}
      <textarea
        name={name}
        required
        placeholder={placeholder}
        rows={4}
        className="rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white outline-none transition placeholder:text-chrome-500 focus:border-electric"
      />
    </label>
  );
}

export function ApplicationForm({ teams }: { teams: ApplicationTeam[] }) {
  const searchParams = useSearchParams();
  const requestedTeam = searchParams.get("team") ?? "";
  const defaultTeam = teams.some((team) => team.id === requestedTeam) ? requestedTeam : "";
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(form);
    const response = await fetch("/api/applications", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(result.message ?? "Application could not be submitted.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(result.message ?? "Application received.");
  }

  return (
    <form onSubmit={submitApplication} className="grid gap-5">
      {status === "success" ? (
        <div className="rounded-md border border-emerald-400/35 bg-emerald-400/10 p-4 text-emerald-100">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="size-5" />
            Pending Commissioner Review
          </div>
          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-md border border-red-400/35 bg-red-500/10 p-4 text-sm font-bold text-red-100">{message}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" name="fullName" placeholder="Your full name" />
        <Field label="Preferred display name" name="preferredDisplayName" placeholder="Name shown on your public owner profile" />
        <Field label="Gamertag" name="gamertag" placeholder="PSN / Madden name" />
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <Field label="Phone number optional" name="phone" type="tel" required={false} placeholder="Optional" />
        <Field label="Time zone" name="timezone" placeholder="Eastern, Central, Pacific..." />
        <label className="grid gap-2 text-sm font-bold text-chrome-200">
          Preferred team
          <select name="preferredTeamId" required defaultValue={defaultTeam} className="min-h-12 rounded-md border border-white/10 bg-black px-4 text-base text-white outline-none transition focus:border-electric">
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label} {team.isOpen ? "(Open)" : "(Owned)"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <TextArea label="Backup team choices" name="backupTeamChoices" placeholder="List 2-4 backup teams." />
      <TextArea label="Madden league experience" name="maddenLeagueExperience" placeholder="Tell us about leagues you have played in." />
      <TextArea label="Availability" name="availability" placeholder="Best days and times to schedule games." />

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="YouTube channel optional" name="youtubeUrl" type="url" required={false} placeholder="https://youtube.com/..." />
        <Field label="Twitch channel optional" name="twitchChannel" required={false} placeholder="channel name" />
        <Field label="Kick channel optional" name="kickUrl" type="url" required={false} placeholder="https://kick.com/..." />
      </div>

      <label className="grid gap-2 text-sm font-bold text-chrome-200">
        Preferred streaming platform
        <select name="preferredPlatform" required defaultValue="None" className="min-h-12 rounded-md border border-white/10 bg-black px-4 text-base text-white outline-none transition focus:border-electric">
          <option value="None">None</option>
          <option value="YouTube">YouTube</option>
          <option value="Twitch">Twitch</option>
          <option value="Kick">Kick</option>
        </select>
      </label>

      <TextArea label="Why do you want to join?" name="whyJoin" placeholder="What kind of owner will you be?" />

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold leading-6 text-chrome-200">
        <input name="readOrientation" type="checkbox" required className="mt-1 size-5 accent-electric" />
        I confirm that I read the Rookie Orientation.
      </label>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold leading-6 text-chrome-200">
        <input name="agreeRulebook" type="checkbox" required className="mt-1 size-5 accent-electric" />
        I agree to the Official Rulebook.
      </label>

      <Button type="submit" variant="electric" size="xl" disabled={status === "submitting"} className="w-full">
        <Send className="size-5" />
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
