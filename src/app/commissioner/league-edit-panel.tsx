"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Save, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

type EditableOwner = {
  id: string;
  name: string;
  gamertag: string;
};

type EditableTeam = {
  id: string;
  fullName: string;
  abbreviation: string;
  owner?: EditableOwner;
};

type EditableGame = {
  id: string;
  week: number;
  awayTeam: string;
  homeTeam: string;
  awayScore?: number;
  homeScore?: number;
  statusLabel: string;
};

const statuses = ["Unscheduled", "Scheduled", "Final", "Force Win", "Sim"];

export function LeagueEditPanel({ owners, teams, games }: { owners: EditableOwner[]; teams: EditableTeam[]; games: EditableGame[] }) {
  const [teamAssignments, setTeamAssignments] = useState(() => new Map(teams.map((team) => [team.id, team.owner?.id ?? ""])));
  const [savedAt, setSavedAt] = useState("");

  const ownerOptions = useMemo(() => owners.map((owner) => ({ value: owner.id, label: `${owner.name} | ${owner.gamertag}` })), [owners]);

  function updateTeam(teamId: string, ownerId: string) {
    setTeamAssignments((current) => {
      const next = new Map(current);
      next.set(teamId, ownerId);
      return next;
    });
  }

  function markSaved() {
    setSavedAt(new Date().toLocaleString());
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
              <ShieldCheck className="size-4" />
              Team Ownership Editor
            </p>
            <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Assign Owners Without Code</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome-300">
              Commissioner-facing ownership controls are staged here so team assignments can be made from the Hub instead of editing source files.
            </p>
          </div>
          <Button type="button" variant="electric" onClick={markSaved}>
            <Save className="size-4" />
            Save Draft
          </Button>
        </div>

        {savedAt ? <p className="mt-3 rounded-md border border-electric/25 bg-electric/10 p-3 text-sm font-bold text-electric">Draft saved locally at {savedAt}. Connect durable storage to persist these assignments across deployments.</p> : null}

        <div className="mt-5 grid max-h-96 gap-3 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-4 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
          {teams.map((team) => (
            <article key={team.id} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-electric">{team.abbreviation}</p>
              <h3 className="mt-1 font-[var(--font-oswald)] text-xl font-bold uppercase leading-none text-white">{team.fullName}</h3>
              <label className="mt-3 grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-chrome-400">
                Owner
                <select value={teamAssignments.get(team.id) ?? ""} onChange={(event) => updateTeam(team.id, event.target.value)} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric">
                  <option value="">Available</option>
                  {ownerOptions.map((owner) => <option key={owner.value} value={owner.value}>{owner.label}</option>)}
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-white/12 bg-black/62 p-5 shadow-chrome">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-electric">
          <CalendarDays className="size-4" />
          Madden Schedule Editor
        </p>
        <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase text-white">Status and Score Drafts</h2>
        <div className="mt-5 grid max-h-96 gap-3 overflow-y-auto pr-2 [scrollbar-color:rgba(0,163,255,0.7)_rgba(255,255,255,0.08)] [scrollbar-width:thin]">
          {games.map((game) => (
            <article key={game.id} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Week {game.week}</p>
                  <h3 className="mt-1 font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{game.awayTeam} at {game.homeTeam}</h3>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <select defaultValue={game.statusLabel} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric">
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <input type="number" min="0" defaultValue={game.awayScore ?? ""} aria-label={`${game.awayTeam} score`} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric" />
                  <input type="number" min="0" defaultValue={game.homeScore ?? ""} aria-label={`${game.homeTeam} score`} className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm font-bold text-white outline-none focus:border-electric" />
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs leading-5 text-chrome-400">
          <UserRound className="size-4 text-electric" />
          This keeps the UI ready for Commissioner edits while the permanent owner/game database is connected.
        </p>
      </section>
    </div>
  );
}
